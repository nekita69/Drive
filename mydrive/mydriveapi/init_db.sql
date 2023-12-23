CREATE TABLE IF NOT EXISTS users(
	user_id INT PRIMARY KEY,
	username VARCHAR(50),
	password VARCHAR(100),     
	is_admin BOOLEAN,
	balance numeric(10,2)      
);

CREATE TABLE IF NOT EXISTS transports_type(
	type_id INT PRIMARY KEY,
	transportType VARCHAR(60) UNIQUE
);  
/* Автомобиль | Мотоцикл | Самокат */

CREATE TABLE IF NOT EXISTS transports(
	trnsp_id INT PRIMARY KEY,
	owner_id INT REFERENCES users(user_id),
	canBeRented boolean,
	transportType varchar(60) REFERENCES transports_type(transportType),
	model varchar(50),
	color varchar(50),
	identifier varchar(10),
	description varchar(255),
	latitude numeric(8,6),
	longitude numeric(8,6), 
	minuteprice numeric(10,2),
	dayprice numeric (10,2)     
);

CREATE TABLE IF NOT EXISTS rent_type(
	type_id INT PRIMARY KEY,
	renttype varchar(20) UNIQUE
);
/* По-минутно | По-суточно | 5 дней | 1 неделя | 2 недели */

/* Пункты аренды */
CREATE TABLE IF NOT EXISTS rent_point(
	id INT PRIMARY KEY,
	name varchar(255) UNIQUE,
	lat numeric(8,6), 
	long numeric(8,6)
);


CREATE TABLE IF NOT EXISTS rents(
	rent_id INT PRIMARY KEY,
	user_id INT REFERENCES users(user_id), 
	trnsp_id INT REFERENCES transports(trnsp_id),
	renttype varchar(20) REFERENCES rent_type(renttype),
	rentprice numeric(10,2),
	description varchar(255),
	rent_point_start varchar(255) REFERENCES rent_point(name),
	rent_point_finish varchar(255),	
	rent_start TIMESTAMP WITHOUT TIME ZONE,
	rent_finish TIMESTAMP WITHOUT TIME ZONE
);

/*
OLD vershion 
CREATE TABLE IF NOT EXISTS rents(
	rent_id INT PRIMARY KEY,
	user_id INT REFERENCES users(user_id),
	trnsp_id INT REFERENCES transports(trnsp_id),
	renttype varchar(20) REFERENCES rent_type(renttype),
	rentprice numeric(10,2),
	description varchar(255),
	lat_start numeric(6,4),
	long_start numeric(7,4),
	rent_start TIMESTAMP WITHOUT TIME ZONE,
	rent_finish TIMESTAMP WITHOUT TIME ZONE
);
*/

CREATE TABLE IF NOT EXISTS his_rents(
	rent_id INT PRIMARY KEY,
	user_id INT,
	username varchar(50), 
	trnsp_id INT,
	model varchar(50),
	renttype varchar(20),
	rentprice numeric(10,2),
	description varchar(255),
	rent_point_start varchar(255),
	rent_point_finish varchar(255),
	rent_start TIMESTAMP WITHOUT TIME ZONE,
	rent_finish TIMESTAMP WITHOUT TIME ZONE
);
/*
OLD vershion 

CREATE TABLE IF NOT EXISTS his_rents(
	rent_id INT PRIMARY KEY,
	user_id INT,
	username varchar(50),
	trnsp_id INT,
	model varchar(50),
	renttype varchar(20),
	rentprice numeric(10,2),
	description varchar(255),
	lat_start numeric(6,4),
	long_start numeric(7,4),
	rent_start TIMESTAMP WITHOUT TIME ZONE,
	rent_finish TIMESTAMP WITHOUT TIME ZONE
);

*/

CREATE TABLE IF NOT EXISTS logs(
	log_id INT PRIMARY KEY,
	user_id INT,
	username VARCHAR(50),
	table_name VARCHAR(30),
	action varchar(15),
	ch_cnt int,
	date_time TIMESTAMP WITHOUT TIME ZONE	
);

CREATE TABLE IF NOT EXISTS tokens(
	token_id INT PRIMARY KEY,
	user_id INT REFERENCES users(user_id),
	token VARCHAR(50),
	timelive TIMESTAMP WITHOUT TIME ZONE	
);

/* Таблица с временными переменными */
CREATE TABLE IF NOT EXISTS temps(
	id INTEGER PRIMARY KEY,
	name VARCHAR(25),
	value INTEGER
);

/* INSERTS  - В функцию
INSERT INTO transports_type VALUES(0, 'автомобиль');
INSERT INTO transports_type VALUES(1, 'мотоцикл');
INSERT INTO transports_type VALUES(2, 'самокат'); 

INSERT INTO rent_type VALUES(0, 'минуты');
INSERT INTO rent_type VALUES(1, 'день');
INSERT INTO rent_type VALUES(2, '5 дней');
INSERT INTO rent_type VALUES(3, '1 неделя');
INSERT INTO rent_type VALUES(4, '2 недели');

INSERT INTO temps VALUES(0, 'cnt_trnsp', 0);


/* Точки аренды ТС */
INSERT INTO rent_point VALUES(0, 'ТЦ "Маяк"', 56.735652, 37.157624);
INSERT INTO rent_point VALUES(1, 'Вокзал "Большая волга"', 56.727683, 37.137313);
INSERT INTO rent_point VALUES(2, 'ул. Вернова', 56.736312, 37.170126);
INSERT INTO rent_point VALUES(3, 'Гостиница "Дубна" Корпус 3', 56.744325, 37.174835);
INSERT INTO rent_point VALUES(4, 'площадь Мира', 56.745747, 37.194376);
INSERT INTO rent_point VALUES(5, 'Дворец спорта "Радуга"', 56.754131, 37.157958);
INSERT INTO rent_point VALUES(6, 'Дубненская городская больница', 56.756219, 37.142659);
*/

/* Создание пользователя */
CREATE OR REPLACE FUNCTION create_user(usename varchar, pass varchar)
RETURNS boolean
AS $$
DECLARE
	cnt_usn INT = 0; next_id INT;
BEGIN
	SELECT COUNT(*) INTO cnt_usn FROM users WHERE lower(username) = lower(usename);
	IF cnt_usn > 0 THEN 
		RAISE EXCEPTION 'Имя пользователя используется';
		RETURN false;
	END IF;
	SELECT MAX(user_id) INTO next_id FROM users;
	IF next_id IS null THEN next_id = 0;
	ELSE next_id = next_id + 1;
	END IF;
	INSERT INTO users VALUES(next_id, usename, pass, 'false', 0.0);
	RETURN true;
END;
$$ LANGUAGE plpgsql;


/* Обновление аккаунта пользователя */
CREATE OR REPLACE FUNCTION update_user(u_id integer, uname varchar, cur_pass varchar, new_pass varchar)
RETURNS boolean
AS $$
DECLARE
	cnt_usn INT = 0; next_id INT;
	cur_username VARCHAR = '';
	cur_pas varchar;
BEGIN
	SELECT username INTO cur_username FROM users WHERE user_id = u_id; /* Если не изменяем имя */
	IF LOWER(cur_username) = LOWER(uname) THEN
		SELECT password INTO cur_pas FROM users WHERE user_id = u_id;
		IF cur_pas = cur_pass THEN
			UPDATE users SET password = new_pass WHERE user_id = u_id;
			RETURN true;
		ELSE
			RAISE EXCEPTION 'Неверный текущий пароль';
			RETURN false;
		END IF;
	END IF;
	
	SELECT COUNT(*) INTO cnt_usn FROM users WHERE lower(username) = lower(uname);
	IF cnt_usn > 0 THEN
		RAISE EXCEPTION 'Имя пользователя используется';
		RETURN false;
	END IF;
	
	SELECT password INTO cur_pas FROM users WHERE user_id = u_id;
		IF cur_pas = cur_pass THEN
			UPDATE users SET username = uname, password = new_pass WHERE user_id = u_id;
			RETURN true;
		ELSE
			RAISE EXCEPTION 'Неверный текущий пароль';
			RETURN false;
		END IF;
END;
$$ LANGUAGE plpgsql;


/* Создание аккаунта администратором */
CREATE OR REPLACE FUNCTION admin_create_account(uname varchar, pass varchar, adm boolean default false, balan numeric default 0.0)
RETURNS boolean
AS $$
DECLARE
	cnt_usn INT = 0; 
	next_id INT;
BEGIN
	SELECT COUNT(*) INTO cnt_usn FROM users WHERE lower(username) = lower(uname);
	IF cnt_usn > 0 THEN
		RAISE EXCEPTION 'Имя пользователя используется'; 
		RETURN false;
	END IF;
	
	SELECT MAX(user_id) INTO next_id FROM users;
	IF next_id IS null THEN next_id = 0;
	ELSE next_id = next_id + 1;
	END IF;
	
	INSERT INTO users VALUES(next_id, uname, pass, adm, balan);
	RETURN true;
END;
$$ LANGUAGE plpgsql;



/* Обновление аккаунта администратором */
CREATE OR REPLACE FUNCTION admin_update_account(u_id integer, uname varchar, pass varchar, adm boolean, balan numeric)
RETURNS boolean
AS $$
DECLARE
	cnt_usn INT = 0; 
	current_name varchar;
BEGIN
	SELECT username INTO current_name FROM users WHERE user_id = u_id;
	IF LOWER(current_name) = LOWER(uname) THEN
		UPDATE users SET password = pass, is_admin = adm, balance = balan WHERE user_id = u_id;
		RETURN true;
	ELSE 
		SELECT COUNT(*) INTO cnt_usn FROM users WHERE lower(username) = lower(uname);
		IF cnt_usn > 0 THEN
			RAISE EXCEPTION 'Имя пользователя используется';
			RETURN false;
		END IF;
		UPDATE users SET username = uname, password = pass, is_admin = adm, balance = balan WHERE user_id = u_id;
		RETURN true;
	END IF;
	RETURN false;
END;
$$ LANGUAGE plpgsql;


/* Добавление ТС */
CREATE OR REPLACE FUNCTION create_transport(u_id integer, cbn boolean, tr_type varchar, mld varchar, clt varchar, idnt varchar, descr varchar, lat numeric, long numeric, minprice numeric, dprice numeric)
RETURNS boolean
AS $$
DECLARE
	usr INT = 0;
	next_id INT;
	t_type_cnt INT = 0;
BEGIN
	SELECT COUNT(*) INTO t_type_cnt FROM transports_type WHERE LOWER(transporttype) = lower(tr_type);
	IF t_type_cnt = 0 THEN
		RAISE EXCEPTION 'Неверный тип транспорта';
		RETURN false;
	END IF;
	SELECT COUNT(*) INTO usr FROM users WHERE user_id = u_id;
	IF usr > 0 THEN
		IF (tr_type != '') AND (mld != '') AND (idnt != '') THEN
			SELECT MAX(trnsp_id) INTO next_id FROM transports;
			IF next_id IS null THEN
				next_id = 0;
			ELSE 
				next_id = next_id + 1;
			END IF;
			INSERT INTO transports VALUES(next_id, u_id, cbn, lower(tr_type), mld, clt, idnt, descr, lat, long, minprice, dprice);
			RETURN true;
		ELSE
			RAISE EXCEPTION 'Тип транспорта, модель и номер транспорта являются обязательными для заполнения';
			RETURN false;
		END IF;
	ELSE
		RAISE EXCEPTION 'Пользователь отсутствует';
		RETURN false;
	END IF;
	RETURN false;
END;
$$ LANGUAGE plpgsql;

/* Обновление транспорта (для владельца ТС) */
/* Нельзя изменить тип ТС */
CREATE OR REPLACE FUNCTION update_transport(u_id integer, tr_id integer, cbn boolean, mld varchar, clt varchar, idnt varchar, descr varchar, lat numeric, long numeric, minprice numeric, dprice numeric)
RETURNS boolean
AS $$
DECLARE
	usr_cnt INT = 0; /* Существование владельца */
	trsp_cnt INT = 0; /* Существование ТС */
	usr_trp_cnt INT = 0; /* Владелец - транспорт */
BEGIN
	SELECT COUNT(*) INTO usr_cnt FROM users WHERE user_id = u_id;
	IF usr_cnt = 0 THEN
		RAISE EXCEPTION 'Пользователь не найден';
		RETURN false;
	END IF;
	SELECT COUNT(*) INTO trsp_cnt FROM transports WHERE trnsp_id = tr_id;
	IF trsp_cnt = 0 THEN
		RAISE EXCEPTION 'Транспорт не найден';
		RETURN false;
	END IF;
	SELECT COUNT(*) INTO usr_trp_cnt FROM transports WHERE trnsp_id = tr_id AND owner_id = u_id;
	IF usr_trp_cnt = 0 THEN
		RAISE EXCEPTION 'Пользователь не является владельцем';
		RETURN false;
	END IF;

	UPDATE transports SET canBeRented = cbn, model = mld, 
		color = clt, identifier = idnt, 
		description = descr, latitude = lat, longitude = long, 
		minutePrice = minprice, dayPrice = dprice
	WHERE trnsp_id = tr_id;
	
	RETURN true;
END;
$$ LANGUAGE plpgsql;





/* Обновление ТС администратором */
CREATE OR REPLACE FUNCTION admin_update_transport(tr_id integer, u_id integer, cbn boolean, tr_type varchar, mld varchar, clt varchar, idnt varchar, descr varchar, lat numeric, long numeric, minprice numeric, dprice numeric)
RETURNS boolean
AS $$
DECLARE
	usr_cnt INT = 0; /* Существование владельца */
	trsp_cnt INT = 0; /* Существование ТС */
	tr_type_cnt INT = 0; /* Существование типа ТС */
BEGIN
	SELECT COUNT(*) INTO usr_cnt FROM users WHERE user_id = u_id;
	IF usr_cnt = 0 THEN RAISE EXCEPTION 'Пользователь отсутствует'; RETURN false;
	END IF;
	
	SELECT COUNT(*) INTO trsp_cnt FROM transports WHERE trnsp_id = tr_id;
	IF trsp_cnt = 0 THEN RAISE EXCEPTION 'Транспорт с выбранным ID отсутствует'; RETURN false;
	END IF;
	
	SELECT COUNT(*) INTO tr_type_cnt FROM transports_type WHERE LOWER(transporttype) = LOWER(tr_type);
	IF tr_type_cnt = 0 THEN RAISE EXCEPTION 'Отсутствует выбранный тип транспорта'; RETURN false;
	END IF;
	
	UPDATE transports SET owner_id = u_id, canBeRented = cbn, transporttype = LOWER(tr_type),
		model = mld, color = clt, identifier = idnt, 
		description = descr, latitude = lat, longitude = long, 
		minutePrice = minprice, dayPrice = dprice
	WHERE trnsp_id = tr_id;
	RETURN true;
END;
$$ LANGUAGE plpgsql;




/* Создание аренды, для пользователя */
CREATE OR REPLACE FUNCTION create_rent(u_id INTEGER, tr_id INTEGER, r_type varchar, rnt_point_start VARCHAR, time_start TIMESTAMP WITHOUT TIME ZONE default '1991-01-01', descr VARCHAR default '')
RETURNS boolean
AS $$
DECLARE
	u_cnt INT = 0; /* Сущестование пользователя */
	tr_cnt INT = 0; /* Сущестование транспорта */
	tr_cb_rent boolean = false; /* Можно ли арендовать транспорт */
	rent_type_cnt INT = 0; /* Сущестование типа аренды */
	next_id INT = -1; /* Следующий ID rent */
	rent_prc INT = 0; /* Цена аренды */
BEGIN
	SELECT COUNT(*) INTO u_cnt FROM users WHERE user_id = u_id;
	IF u_cnt = 0 THEN RAISE EXCEPTION 'Пользователь не найден'; RETURN false;
	END IF;
	
	SELECT COUNT(*) INTO tr_cnt FROM transports WHERE trnsp_id = tr_id;
	IF tr_cnt = 0 THEN RAISE EXCEPTION 'Транспорт не найден'; RETURN false;
	END IF;
	
	SELECT canberented INTO tr_cb_rent FROM transports WHERE trnsp_id = tr_id;
	IF tr_cb_rent = false THEN RAISE EXCEPTION 'Данный транспорт нельзя арендовать'; RETURN false;
	END IF;
	
	SELECT COUNT(*) INTO rent_type_cnt FROM rent_type WHERE renttype = r_type;
	IF rent_type_cnt = 0 THEN RAISE EXCEPTION 'Неверный тип аренды'; RETURN false;
	END IF;
	
	IF r_type = 'минуты' THEN SELECT minuteprice INTO rent_prc FROM transports WHERE trnsp_id = tr_id;
	ELSE SELECT dayprice INTO rent_prc FROM transports WHERE trnsp_id = tr_id;
	END IF;
	
	SELECT MAX(rent_id) INTO next_id FROM rents;
	IF next_id IS null THEN next_id = 0;
	ELSE 
		next_id = next_id + 1;
	END IF;
	
	UPDATE transports SET canberented = 'false' WHERE trnsp_id = tr_id; /* Создали аренду - транспорт нельзя арендовать */
	
	IF time_start = '1991-01-01' THEN
		INSERT INTO rents VALUES(next_id, u_id, tr_id, r_type, rent_prc, descr, rnt_point_start, null, NOW(), null);
	ELSE 
		INSERT INTO rents VALUES(next_id, u_id, tr_id, r_type, rent_prc, descr, rnt_point_start, null, time_start, null);
	END IF;
	RETURN true;
END;
$$ LANGUAGE plpgsql;


/* Завершение аренды пользователем */
CREATE OR REPLACE FUNCTION delete_rent(rnt_id INTEGER, u_id INTEGER, rent_point_fnh VARCHAR)
RETURNS boolean
AS $$
DECLARE
	usr INT = 0; /* Сущестование пользователя */
	rent_usr_cnt INT = 0; /* Сущестование аренды у конктерного пользователя */
	tr_id INT = -1; /* Определение транспорта аренды */
	lat_f NUMERIC;
	long_f NUMERIC;
BEGIN
	/* Логика завершения аренды */
	/* Списание с аккаунта */
	/* Расчет финальной стоимости */
	/* Перевод аренды в таблицу истории аренды [?]*/
	SELECT COUNT(*) INTO usr FROM users WHERE user_id = u_id;
	IF usr = 0 THEN RAISE EXCEPTION 'Пользователь не найден'; RETURN false;
	END IF;
	
	SELECT COUNT(*) INTO rent_usr_cnt FROM rents WHERE user_id = u_id AND rent_id = rnt_id;
	IF rent_usr_cnt = 0 THEN RAISE EXCEPTION 'Пользователь не является арендатором'; RETURN false;
	END IF;
	
	SELECT lat INTO lat_f FROM rent_point WHERE name = rent_point_fnh;
	SELECT long INTO long_f FROM rent_point WHERE name = rent_point_fnh;
	
	UPDATE rents SET rent_finish = NOW(), rent_point_finish = rent_point_fnh WHERE rent_id = rnt_id; /* Устанавливаем время конца аренды */
	SELECT trnsp_id INTO tr_id FROM rents WHERE rent_id = rnt_id; /* Определяем арендованный транспорт */
	/* Транспорт можно обновлять, изменение координат местоположения транспорта */
	UPDATE transports SET canberented = true, latitude = lat_f, longitude = long_f WHERE trnsp_id = tr_id;
	RETURN true;
END;
$$ LANGUAGE plpgsql;

/*
SELECT * FROM rent_point;
SELECT * FROM transports;
UPDATE transports SET latitude = 56.735652, longitude = 37.157624 WHERE trnsp_id = 0;
*/

/* Завершение аренды администратором */
CREATE OR REPLACE FUNCTION admin_delete_rent(rnt_id INTEGER, rnt_p_fin VARCHAR)
RETURNS boolean
AS $$
DECLARE
	rent_usr_cnt INT = 0; /* Сущестование аренды у конктерного пользователя */
	tr_id INT = -1; /* Определение транспорта аренды */
	lat_f NUMERIC;
	long_f NUMERIC;
BEGIN
	/* Логика завершения аренды */
	/* Списание с аккаунта */
	/* Расчет финальной стоимости */
	/* Перевод аренды в таблицу истории аренды [?]*/
	
	SELECT COUNT(*) INTO rent_usr_cnt FROM rents WHERE rent_id = rnt_id AND rent_finish is null;
	IF rent_usr_cnt = 0 THEN RAISE EXCEPTION 'Аренда уже завершена'; RETURN false;
	END IF;
	
	
	SELECT lat INTO lat_f FROM rent_point WHERE name = rnt_p_fin;
	SELECT long INTO long_f FROM rent_point WHERE name = rnt_p_fin;
	
	UPDATE rents SET rent_finish = NOW(), rent_point_finish = rnt_p_fin WHERE rent_id = rnt_id; /* Устанавливаем время конца аренды */
	SELECT trnsp_id INTO tr_id FROM rents WHERE rent_id = rnt_id; /* Определяем арендованный транспорт */
	/* Транспорт можно обновлять, изменение координат местоположения транспорта */
	UPDATE transports SET canberented = true, latitude = lat_f, longitude = long_f WHERE trnsp_id = tr_id;
	RETURN true;
END;
$$ LANGUAGE plpgsql;


/* удаление администратором аренды по id, перенос в таблицу his_rents */
CREATE OR REPLACE FUNCTION admin_rent_delete(rnt_id INTEGER)
RETURNS boolean
AS $$
DECLARE
	rent_usr_cnt INT = 0; /* Сущестование аренды */
	tr_id INT = -1; /* Определение транспорта аренды */
	u_id INT = -1;
	mdl VARCHAR;
	usname VARCHAR;
	
BEGIN
	SELECT COUNT(*) INTO rent_usr_cnt FROM rents WHERE rent_id = rnt_id AND rent_finish is not null;
	IF rent_usr_cnt = 0 THEN RAISE EXCEPTION 'Аренда не заверщена'; RETURN false;
	END IF;
	SELECT trnsp_id INTO tr_id FROM rents WHERE rent_id = rnt_id;
	SELECT user_id INTO u_id FROM rents WHERE rent_id = rnt_id;
	SELECT username INTO usname FROM users WHERE user_id = u_id;
	SELECT model INTO mdl FROM transports WHERE trnsp_id = tr_id;
	
	INSERT INTO his_rents(rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish)
	SELECT rent_id, user_id, trnsp_id, renttype, rentprice, description, rent_point_start, rent_point_finish, rent_start, rent_finish
	FROM rents
	WHERE rent_id = rnt_id;
	
	UPDATE his_rents SET username = usname, model = mdl WHERE rent_id = rnt_id;
	DELETE FROM rents WHERE rent_id = rnt_id;
	RETURN true;
END;
$$ LANGUAGE plpgsql;


/* Тригерная функция, удаление записи о аренде */
CREATE OR REPLACE FUNCTION delete_rent_for_trgr()
RETURNS trigger 
AS $$
DECLARE
	cnt INT = 0;
BEGIN
	SELECT COUNT(*) INTO cnt FROM rents WHERE rent_id = OLD.rent_id AND rent_finish is null;
	IF cnt > 0 THEN
		RAISE EXCEPTION 'Аренда незавершена';
		RETURN NULL;
	END IF;
	RETURN OLD;
END;
$$ 
LANGUAGE plpgsql;

/* Триггер на удаление из таблицы rents */
/* Вызвать до удаления */
CREATE OR REPLACE TRIGGER delete_rent_for_trigger
BEFORE DELETE ON rents
FOR EACH ROW 
EXECUTE FUNCTION delete_rent_for_trgr();



/* Тригерная функция, удаление транспорта */
CREATE OR REPLACE FUNCTION delete_transport()
RETURNS trigger 
AS $$
DECLARE
	cnt_trnsp_cur_rents INT = 0;
	curs cursor(tr_id INT) FOR SELECT rent_id FROM rents WHERE trnsp_id = tr_id; /* Все аренды, в которых был ТС */
	rec record;
	tmp bool;
BEGIN
	/* Подсчет незавершенных аренд */
	SELECT COUNT(*) INTO cnt_trnsp_cur_rents FROM rents WHERE trnsp_id = OLD.trnsp_id AND rent_finish is null;
	IF cnt_trnsp_cur_rents > 0 THEN
		RAISE EXCEPTION 'Транспорт арендуется';
		RETURN NULL;
	END IF;
	
	for rec in curs(OLD.trnsp_id) /* Проходимся по арендам пользователя */
		loop
			SELECT admin_rent_delete(rec.rent_id) INTO tmp; /* Вызываем функцию для удаления записи о аренде */
		end loop;
	RETURN OLD;
END;
$$ 
LANGUAGE plpgsql;

/* Триггер на удаление из таблицы transports */
/* Вызвать до удаления */
CREATE OR REPLACE TRIGGER delete_transport_trigger
BEFORE DELETE ON transports
FOR EACH ROW 
EXECUTE FUNCTION delete_transport();



/* Триггерная функция для удаления аккаунта */
CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS trigger 
AS $$
DECLARE
	cnt_curr_rents INT = 0;
	cnt_trnsp_cur_rents INT = 0;
	
	curs cursor(u_id INT) FOR SELECT rent_id FROM rents WHERE user_id = u_id; /* Все аренды у пользователя */
	curs1 cursor(u_id INT) FOR SELECT trnsp_id FROM transports WHERE owner_id = u_id; /* Весь транспорт */
	
	rec record;
	rec1 record;
BEGIN
	/* Подсчет незаверщенных аренд */
	SELECT COUNT(*) INTO cnt_curr_rents FROM rents WHERE user_id = OLD.user_id AND rent_finish is null;
	IF cnt_curr_rents > 0 THEN
		RAISE EXCEPTION 'Пользователь имеет незавершенные аренды';
		RETURN null;
	END IF;
	
	/* Подсчет транспорта, который аренуется в данное время */
	SELECT COUNT(*) INTO cnt_trnsp_cur_rents FROM transports, rents WHERE transports.owner_id = OLD.user_id 
	AND transports.trnsp_id = rents.trnsp_id AND rent_finish is null; 
	IF cnt_trnsp_cur_rents > 0 THEN
		RAISE EXCEPTION 'Пользователь имеет транспорт, который арендуют';
		RETURN null;
	END IF;
	

	for rec in curs(OLD.user_id) /* Проходимся по арендам пользователя */
		loop
			SELECT admin_rent_delete(rec.rent_id); /* Вызываем функцию для удаления записи о аренде */
		end loop;
	
	/* Пройтись по всем ТС, удалить весь ТС */
	for rec1 in curs1(OLD.user_id) /* Проходимся транспорту пользователя */
		loop
			 DELETE FROM transports WHERE trnsp_id = rec1.trnsp_id; /* Удаляем ТС */
		end loop;
	
	RETURN OLD;
END;
$$ 
LANGUAGE plpgsql;

/* Триггер на удаление из таблицы users */
/* Вызвать до удаления */
CREATE OR REPLACE TRIGGER delete_user_account_trigger
BEFORE DELETE ON users
FOR EACH ROW 
EXECUTE FUNCTION delete_user_account();


/* ТРИГГЕРЫ для logs */
CREATE OR REPLACE FUNCTION cnt_act() 
RETURNS trigger 
AS $trigger1$
DECLARE
	cnt integer;
BEGIN
 	/* Подсчет изменений в таблице transports */
	SELECT value INTO cnt FROM temps WHERE name = 'cnt_trnsp';
	cnt = cnt + 1;
	UPDATE temps SET value = cnt WHERE name = 'cnt_trnsp';	
	RETURN NEW;
END;
$trigger1$
LANGUAGE plpgsql;

create or replace TRIGGER cnt_act_trigger
AFTER INSERT or UPDATE or DELETE ON transports
FOR EACH ROW
EXECUTE FUNCTION cnt_act();

CREATE OR REPLACE FUNCTION cnt_act_write() 
RETURNS trigger 
AS $t3$
DECLARE	
	dat timestamp; /* Тип данных, позволяющий хранить дату и время */
	usernm VARCHAR(25);
	us_id integer;
	act VARCHAR(25);
	cnt INTEGER;
	next_id INTEGER;
BEGIN
	SELECT value INTO cnt FROM temps WHERE name = 'cnt_trnsp';
	SELECT MAX(log_id) INTO next_id FROM logs; /* Для определения следующего ID */
	
	IF next_id IS null THEN
		next_id = 0;
	ELSE
		next_id = next_id + 1;
	END IF;
	
	dat = NOW(); /* Дата и время */
	usernm := current_user; /* Имя пользователя */
	SELECT usesysid INTO us_id FROM pg_user WHERE usename = usernm; /* Определение ID пользователя в СУБД */
		
	/* Определение действия */
	IF TG_OP = 'INSERT' THEN
		act:='INSERT';
	END IF;
	if TG_OP = 'UPDATE' then
		act:='UPDATE';
	END IF;
	IF TG_OP = 'DELETE' THEN
		act:='DELETE';
	END IF;
	
	/*
	RAISE NOTICE 'Действие: %', act; 
	RAISE NOTICE 'Имя пользователя: %', usernm; 
	RAISE NOTICE 'ID пользователя : %', us_id; 
	RAISE NOTICE 'Дата и время: %', dat; 
	*/
	
	INSERT INTO logs VALUES(next_id, us_id, usernm, 'transports', act, cnt, dat);
	
	UPDATE temps SET value = 0 WHERE name = 'cnt_trnsp';
	RETURN NEW;
END;
$t3$ 
LANGUAGE plpgsql;

create or replace TRIGGER cnt_act_write_trigger
AFTER INSERT or UPDATE or DELETE ON transports
EXECUTE FUNCTION cnt_act_write();


/* NOW() - interval '3 day' */