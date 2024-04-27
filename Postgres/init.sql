\c users;

CREATE TABLE users (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	document_type character varying(5) NOT NULL,
	document_number integer NOT NULL,
	first_name character varying(100) NOT NULL,
	last_name character varying(100) NOT NULL,
	age integer NOT NULL,
	birthdate date,
	email character varying(100)
);

CREATE TABLE credentials (
	id uuid DEFAULT gen_random_uuid() NOT NULL,
	user_name character varying(100) NOT NULL,
	user_password character varying(100) NOT NULL,
	fk_users uuid NOT NULL
);


ALTER TABLE credentials
	ADD CONSTRAINT credentials_fk_users_key UNIQUE (fk_users);


ALTER TABLE credentials
	ADD CONSTRAINT credentials_user_name_key UNIQUE (user_name);


ALTER TABLE credentials
	ADD CONSTRAINT pk_credentials PRIMARY KEY (id);


ALTER TABLE users
	ADD CONSTRAINT pk_users PRIMARY KEY (id);


ALTER TABLE users
	ADD CONSTRAINT users_document_number_key UNIQUE (document_number);


ALTER TABLE credentials
	ADD CONSTRAINT fk_users_credentials FOREIGN KEY (fk_users) REFERENCES users(id);


CREATE FUNCTION delete_user(integer) RETURNS json
    LANGUAGE plpgsql
    AS $$
	DECLARE
		id_user RECORD;
	BEGIN

		BEGIN

			SELECT U.document_number INTO id_user FROM users U WHERE U.document_number = $1;
			IF NOT FOUND THEN
				RETURN json_build_object(
					'status', 404,
					'data', json_build_object('error', 'User not found')
				);
			END IF;
	
			DELETE FROM credentials
			WHERE fk_users = (SELECT id FROM users WHERE document_number = $1)
			RETURNING * INTO id_user;
	
			IF NOT FOUND THEN
				RETURN json_build_object(
					'status', 500,
					'data', json_build_object('error', 'Error when trying to delete user')
				);
			END IF;
	
			DELETE FROM users
			WHERE document_number = $1
			RETURNING * INTO id_user;
	
			IF NOT FOUND THEN
				RETURN json_build_object(
					'status', 500,
					'data', json_build_object('error', 'Error when trying to delete user')
				);
			END IF;

		EXCEPTION WHEN OTHERS THEN
			RETURN json_build_object(
				'status', 500,
				'data', json_build_object('error', SQLERRM)
			);
	
		END;

		RETURN json_build_object(
			'status', 200,
			'data', json_build_object('message', 'User deleted')
		);
	
	END;
$$;


CREATE FUNCTION insert_user(json) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
	user_id UUID;
	credentials_id UUID;
	data_user JSON;
	credentials_user JSON;
BEGIN
	
	SELECT id INTO user_id FROM users WHERE email = $1->>'email'; 
	IF user_id IS NOT NULL THEN
		RETURN json_build_object(
			'status', 409,
			'data', json_build_object('error', 'The email already exists')
		);
	END IF;


	SELECT gen_random_uuid() INTO user_id;
	SELECT gen_random_uuid() INTO credentials_id;
	
	BEGIN
	
		INSERT INTO users VALUES(
			user_id,
			$1->>'document_type',
			($1->>'document_number')::INTEGER,
			$1->>'first_name',
			$1->>'last_name',
			($1->>'age')::INTEGER,
			($1->>'birthdate')::DATE,
			$1->>'email'
		)
		RETURNING '{"document_number":'|| (document_number) ||'}'
		INTO data_user;

		IF NOT FOUND THEN
			RETURN json_build_object(
				'status', 500,
				'data', json_build_object('error', 'Error when trying to insert user')
			);
		END IF;

		INSERT INTO credentials VALUES(
			credentials_id,
			$1->>'email',
			$1->>'user_password',
			user_id
		)
		RETURNING '{"user_name":"' || user_name || '"}'
		INTO credentials_user;

		IF NOT FOUND THEN
			RETURN json_build_object(
				'status', 500,
				'data', json_build_object('error','Error when trying to insert user credentials')
			);
		END IF;
	
	EXCEPTION WHEN OTHERS THEN
		RETURN json_build_object(
			'status', 500,
			'data', json_build_object('error', SQLERRM)
		);

	END;
	
	RETURN json_build_object(
		'status', 201,
		'data',json_build_object('message', 'User created')
	);
END;
$$;


CREATE FUNCTION update_user(integer, jsonb) RETURNS json
    LANGUAGE plpgsql
    AS $$
	DECLARE
		document_user INTEGER;
		email_user TEXT;
		result_json ALIAS FOR $2;
	BEGIN
		BEGIN
	
			SELECT U.document_number INTO document_user FROM users U WHERE U.document_number = $1;
			IF NOT FOUND THEN
				RETURN json_build_object(
					'status', 404,
					'data', json_build_object('error', 'User not found')
				);
			END IF;
	
			IF 
				EXISTS(
					SELECT 1 FROM jsonb_object_keys($2) AS key
					WHERE key = 'email'
				)
			THEN

				SELECT email INTO email_user FROM users WHERE email = $2->>'email';

				IF email_user IS NOT NULL THEN
	
					RETURN json_build_object(
						'status', 409,
						'data', json_build_object('error', 'The email already exists')
					);
				END IF;
			END IF;
	
	
			IF 
				EXISTS(
					SELECT 1 FROM jsonb_object_keys($2) AS key
					WHERE key = 'user_password'
				)
			THEN
	
				UPDATE credentials SET user_password = $2->>'user_password'
				WHERE fk_users = (SELECT id FROM users U WHERE U.document_number = $1);

				-- remove user_password element from given json 
				result_json := $2 - 'user_password';
	
				IF
					result_json = '{}' OR
					jsonb_typeof(result_json) = 'null'
				THEN
					RETURN json_build_object(
						'status', 200,
						'data', json_build_object('message', 'Password updated')
					);
				END IF;
			END IF;
	
			EXECUTE 'UPDATE users U SET ' ||
			(
				SELECT STRING_AGG(key || '=' || quote_literal(value), ', ')
				FROM jsonb_each_text(result_json)
				AS j(key, value)
			)
			|| ' WHERE U.document_number = $1' USING document_user;

		EXCEPTION WHEN OTHERS THEN
		RETURN json_build_object(
			'status', 500,
			'data', json_build_object('error', SQLERRM)
		);

		END;
	RETURN json_build_object(
		'status', 200,
		'data', json_build_object('message', 'User updated'));
	END;
$$;


CREATE FUNCTION update_email() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
	BEGIN

		IF NEW.email IS NOT NULL THEN
    		UPDATE credentials
			SET user_name = NEW.email
			WHERE fk_users = NEW.id;
		END IF;
	
		RETURN NEW;
	
	END;
$$;

CREATE TRIGGER update_email_credentials AFTER UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_email();
