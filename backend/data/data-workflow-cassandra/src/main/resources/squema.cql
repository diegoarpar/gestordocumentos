CREATE KEYSPACE my_keyspace WITH REPLICATION = {'class': 'SimpleStrategy', 'replication_factor': 1};

INSERT INTO my_keyspace.process(user_id) VALUES (1) USING TTL 10;
INSERT INTO my_keyspace.process(user_id) VALUES (2) USING TTL 20;
select * from my_keyspace.process;