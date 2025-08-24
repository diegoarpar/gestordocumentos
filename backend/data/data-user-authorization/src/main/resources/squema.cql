CREATE KEYSPACE user_authorization WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};

INSERT INTO user_authorization.process(user_id) VALUES (1) USING TTL 10;
INSERT INTO user_authorization.process(user_id) VALUES (2) USING TTL 20;
select * from user_authorization.process;