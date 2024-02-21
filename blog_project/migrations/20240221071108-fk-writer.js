"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.addConstraint("boards", {
            // FK를 설정할 테이블 (DB에 있는 테이블 이름과 같아야한다.)
            fields: ["writer"], // FK로 등록할 필드 이름
            type: "foreign key",
            name: "writer_fk",
            references: {
                table: "members", // 참조할 테이블 (DB에 있는 테이블 이름과 같아야한다.)
                field: "id", // 참조할 필드 이름
            },
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
};
