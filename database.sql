CREATE DATABASE coloide

CREATE TABLE test (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

INSERT INTO test(username, email, password) VALUES('baby', 'baby@polynatural.com', 'password');


CREATE TABLE users(
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id uuid,
  username VARCHAR(255) NOT NULL,
  firstname VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  lastlogin TIMESTAMP
);

-- Insert fake users

INSERT INTO users(client_id, username, firstname, lastname, email, password, lastlogin) 
VALUES (NULL,'testuser', 'norman', 'oliden', 'norman@oliden', 'pass', NOW());


-- I can add a foreign key with alter table (var) references (table)(other var)

CREATE TABLE clients(
  client_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_number VARCHAR(255)
);

CREATE TABLE tasks (
  task_id SERIAL PRIMARY KEY DEFAULT,
  task_name VARCHAR(255) NOT NULL,
  task VARCHAR(255) NOT NULL,
  units VARCHAR(255) NOT NULL,
  instructions VARCHAR(255),
);