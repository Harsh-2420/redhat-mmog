--- load with 
--- psql "dbname='webdb' user='webdbuser' password='password' host='localhost'" -f schema.sql
GRANT ALL PRIVILEGES ON TABLE ftduser, score TO webdbuser;
-- DROP TABLE IF EXISTS ftduser;

-- Revoke all privileges from the existing tables if needed
-- REVOKE ALL PRIVILEGES ON TABLE ftduser, score FROM public;

-- Drop the existing tables if they exist
DROP TABLE IF EXISTS ftduser CASCADE;
DROP TABLE IF EXISTS score CASCADE;

CREATE TABLE ftduser (
	username VARCHAR(20) PRIMARY KEY,
	password BYTEA NOT NULL,
	firstname VARCHAR(20),
	lastname VARCHAR(20),
	email VARCHAR(100),
	birthday VARCHAR(30)
);

ALTER TABLE ftduser OWNER TO webdbuser;

DROP TABLE IF EXISTS score;
CREATE TABLE score (
	username VARCHAR(20) PRIMARY KEY,
	score INT
);

ALTER TABLE score OWNER TO webdbuser;
--- Could have also stored as 128 character hex encoded values
--- select char_length(encode(sha512('abc'), 'hex')); --- returns 128
INSERT INTO ftduser VALUES('arnold', sha512('spiderman'), 'dummy', 'user', 'jj@email.com', '1990-10-25');
INSERT INTO score VALUES('arnold', 0);
INSERT INTO ftduser VALUES('harsh', sha512('jj'), 'dum', 'userb', 'jja@email.com', '1991-10-25');
INSERT INTO score VALUES('harsh', 0);