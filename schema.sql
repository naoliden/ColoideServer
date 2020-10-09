CREATE TABLE "clients" (
  "client_id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL DEFAULT 'Independiente'
);

CREATE TABLE "users" (
  "user_id" SERIAL PRIMARY KEY,
  "client_id" integer NOT NULL,
  "firstname" varchar NOT NULL,
  "lastname" varchar NOT NULL,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "user_type" varchar NOT NULL
);

CREATE TABLE "ensayos" (
  "ensayo_id" SERIAL PRIMARY KEY,
  "variety_id" integer NOT NULL,
  "mediciones" integer NOT NULL,
  "origen" varchar NOT NULL,
  "destino" varchar,
  "calibre" integer,
  "lab" boolean NOT NULL,
  "unidad_experimental" varchar NOT NULL,
  "unidades_por_ue" integer DEFAULT 1,
  "replicas" integer NOT NULL,
  "tratamientos" integer NOT NULL,
  "comentario" varchar NOT NULL DEFAULT '',
  "status" varchar NOT NULL DEFAULT 'en proceso'
);

CREATE TABLE "fechasMediciones" (
  "fecha_id" SERIAL,
  "ensayo_id" integer,
  "fecha" datetime NOT NULL,
  "tipo" varchar NOT NULL DEFAULT 'medicion inicial',
  PRIMARY KEY ("fecha_id", "ensayo_id")
);

CREATE TABLE "tratamientos" (
  "tratamiento_id" SERIAL PRIMARY KEY,
  "fecha_id" integer NOT NULL,
  "nombre_tratamiento" varchar NOT NULL
);

CREATE TABLE "medicionValor" (
  "value_id" SERIAL PRIMARY KEY,
  "tratamiento_id" integer NOT NULL,
  "value" integer NOT NULL DEFAULT 0,
  "task_id" integer NOT NULL
);

CREATE TABLE "tasks" (
  "task_id" SERIAL PRIMARY KEY,
  "task_name" varchar UNIQUE NOT NULL,
  "instrucciones" varchar DEFAULT '',
  "unidades" varchar DEFAULT ''
);

CREATE TABLE "fruits" (
  "fruit_id" SERIAL PRIMARY KEY,
  "name" varchar UNIQUE NOT NULL
);

CREATE TABLE "fruitVariety" (
  "variety_id" SERIAL PRIMARY KEY,
  "fruit_id" integer NOT NULL,
  "variety" varchar UNIQUE NOT NULL
);

CREATE TABLE "usersTests" (
  "user_id" integer,
  "test_id" integer,
  PRIMARY KEY ("user_id", "test_id")
);

CREATE TABLE "fruitsTasks" (
  "fruit_id" integer,
  "task_id" integer,
  PRIMARY KEY ("fruit_id", "task_id")
);

ALTER TABLE "fechasMediciones" ADD FOREIGN KEY ("ensayo_id") REFERENCES "ensayos" ("ensayo_id");

ALTER TABLE "tratamientos" ADD FOREIGN KEY ("fecha_id") REFERENCES "fechasMediciones" ("fecha_id");

ALTER TABLE "medicionValor" ADD FOREIGN KEY ("tratamiento_id") REFERENCES "tratamientos" ("tratamiento_id");

ALTER TABLE "medicionValor" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("task_id");

ALTER TABLE "fruitsTasks" ADD FOREIGN KEY ("fruit_id") REFERENCES "fruits" ("fruit_id");

ALTER TABLE "fruitsTasks" ADD FOREIGN KEY ("task_id") REFERENCES "tasks" ("task_id");

ALTER TABLE "ensayos" ADD FOREIGN KEY ("variety_id") REFERENCES "fruitVariety" ("variety_id");

ALTER TABLE "users" ADD FOREIGN KEY ("client_id") REFERENCES "clients" ("client_id");

ALTER TABLE "usersTests" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("user_id");

ALTER TABLE "usersTests" ADD FOREIGN KEY ("test_id") REFERENCES "ensayos" ("ensayo_id");

ALTER TABLE "fruitVariety" ADD FOREIGN KEY ("fruit_id") REFERENCES "fruits" ("fruit_id");


COMMENT ON COLUMN "clients"."name" IS 'Nombre de la empresa cliente';

COMMENT ON COLUMN "users"."user_type" IS 'admin, client, collector';

COMMENT ON COLUMN "ensayos"."variety_id" IS 'variedad de especie de fruta';

COMMENT ON COLUMN "ensayos"."mediciones" IS 'numero de mediciones que se haran';

COMMENT ON COLUMN "ensayos"."lab" IS 'Se realiza en lab o en linea de packing';

COMMENT ON COLUMN "ensayos"."unidad_experimental" IS 'fruta individual, bandeja o malla';

COMMENT ON COLUMN "ensayos"."unidades_por_ue" IS 'tamaño de la unidad experimental. NO IMPORTA MUCHO';

COMMENT ON COLUMN "ensayos"."replicas" IS 'tamaño de cada tratamiento T-i';

COMMENT ON COLUMN "ensayos"."tratamientos" IS 'cantidad de tratamientos T-i]';

COMMENT ON COLUMN "ensayos"."comentario" IS 'Comentarios sobre la i-esima medicion';

COMMENT ON COLUMN "ensayos"."status" IS 'en proceso, terminado, incompleto';

COMMENT ON COLUMN "fechasMediciones"."ensayo_id" IS 'a que test pertenece';

COMMENT ON COLUMN "fechasMediciones"."fecha" IS 'fecha de la medicion';

COMMENT ON COLUMN "fechasMediciones"."tipo" IS 'medicion inicial, en frio o ambiente';

COMMENT ON COLUMN "tratamientos"."fecha_id" IS 'id de la fech de medicion';

COMMENT ON COLUMN "tratamientos"."nombre_tratamiento" IS 'nombre de la replica T0, T1, etc';

COMMENT ON COLUMN "medicionValor"."value" IS 'valor de la medicion, frente a presencia o no presencia, 1 o 0';

COMMENT ON COLUMN "medicionValor"."task_id" IS 'id del tipo de medicion';

COMMENT ON COLUMN "tasks"."task_name" IS 'nombre de la medicion. eg: peso, #podridos';

COMMENT ON COLUMN "tasks"."instrucciones" IS 'instrucciones de como realizar la medicion';

COMMENT ON COLUMN "tasks"."unidades" IS 'unidades de la medicion';

COMMENT ON COLUMN "fruitVariety"."fruit_id" IS 'Id del tipo de fruta al que pertenece esta variedad';

COMMENT ON COLUMN "fruitVariety"."variety" IS 'Variedad de fruta, eg: Pink Lady';
