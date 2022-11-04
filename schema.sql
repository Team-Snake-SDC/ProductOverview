DROP TABLE IF EXISTS product cascade;
DROP TABLE IF EXISTS features cascade;
DROP TABLE IF EXISTS related cascade;
DROP TABLE IF EXISTS styles cascade;
DROP TABLE IF EXISTS skus cascade;
DROP TABLE IF EXISTS photos cascade;

CREATE TABLE product (
 id INTEGER,
 name VARCHAR(100),
 slogan VARCHAR(1000),
 description VARCHAR(1000),
 category VARCHAR(100),
 default_price INTEGER
);


ALTER TABLE product ADD CONSTRAINT product_pkey PRIMARY KEY (id);

CREATE TABLE features (
 id BIGSERIAL,
 product_id INTEGER,
 feature VARCHAR(100),
 value VARCHAR(100)
);


ALTER TABLE features ADD CONSTRAINT features_pkey PRIMARY KEY (id);

CREATE TABLE related (
 id BIGSERIAL,
 current_product_id INTEGER,
 related_product_id INTEGER
);


ALTER TABLE related ADD CONSTRAINT related_pkey PRIMARY KEY (id);

CREATE TABLE styles (
 id BIGSERIAL,
 productId INTEGER,
 name VARCHAR(100),
 sale_price INTEGER NULL DEFAULT NULL,
 original_price INTEGER,
 default_style BOOLEAN
);


ALTER TABLE styles ADD CONSTRAINT styles_pkey PRIMARY KEY (id);

CREATE TABLE skus (
 id BIGSERIAL,
 styleId INTEGER,
 size VARCHAR(10),
 quantity INTEGER
);


ALTER TABLE skus ADD CONSTRAINT skus_pkey PRIMARY KEY (id);

CREATE TABLE photos (
 id BIGSERIAL,
 styleId INTEGER,
 url VARCHAR,
 thumbnail_url VARCHAR
);


ALTER TABLE photos ADD CONSTRAINT photos_pkey PRIMARY KEY (id);

ALTER TABLE features ADD CONSTRAINT features_product_id_fkey FOREIGN KEY (product_id) REFERENCES product(id);
ALTER TABLE related ADD CONSTRAINT related_current_product_id_fkey FOREIGN KEY (current_product_id) REFERENCES product(id);
ALTER TABLE styles ADD CONSTRAINT styles_productId_fkey FOREIGN KEY (productId) REFERENCES product(id);
ALTER TABLE skus ADD CONSTRAINT skus_styleId_fkey FOREIGN KEY (styleId) REFERENCES styles(id);
ALTER TABLE photos ADD CONSTRAINT photos_styleId_fkey FOREIGN KEY (styleId) REFERENCES styles(id);

COPY product(id, name, slogan, description, category, default_price)
FROM '/home/andrew/hackreactor/ProductOverview/product.csv'
DELIMITER ','
CSV HEADER;

COPY features(id, product_id, feature, value)
FROM '/home/andrew/hackreactor/ProductOverview/features.csv'
DELIMITER ','
CSV HEADER;

COPY related(id, current_product_id, related_product_id)
FROM '/home/andrew/hackreactor/ProductOverview/related.csv'
DELIMITER ','
CSV HEADER;

COPY styles(id,productId,name,sale_price,original_price,default_style)
FROM '/home/andrew/hackreactor/ProductOverview/styles.csv'
(format csv, null "null",
DELIMITER ',',
HEADER
);

COPY skus(id, styleId, size, quantity)
FROM '/home/andrew/hackreactor/ProductOverview/skus.csv'
DELIMITER ','
CSV HEADER;

COPY photos(id, styleId, url, thumbnail_url)
FROM '/home/andrew/hackreactor/ProductOverview/photos.csv'
DELIMITER ','
QUOTE E'\b'
CSV HEADER;

CREATE INDEX product_index ON product (id);
CREATE INDEX features_index ON features (product_id);
CREATE INDEX related_index ON related (current_product_id);
CREATE INDEX styles_index ON styles (id);
CREATE INDEX skus_index ON skus (styleId);
CREATE INDEX photos_index ON photos (styleId);