create sequence bm_id_seq start with 1 increment by 50;

create table product (
    id bigint default nextval('bm_id_seq') not null,
    name varchar(255) not null,
    image varchar(255) not null,
    quantity int,
    price int,
    weight int,
    description varchar(255),
    primary key (id)
);