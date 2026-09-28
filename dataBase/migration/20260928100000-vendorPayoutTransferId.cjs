"use strict";

/*
 * Separate charges and transfers: one PaymentIntent charges the full cart total
 * to the platform, then one Transfer per vendor moves that vendor's share.
 * transfer_id stores the Stripe transfer so a refund can reverse exactly the
 * transfers that were made, and failure_reason records why a transfer failed.
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("vendor_payouts", "transfer_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });

    await queryInterface.addColumn("vendor_payouts", "failure_reason", {
      type: Sequelize.STRING(500),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("vendor_payouts", "failure_reason");
    await queryInterface.removeColumn("vendor_payouts", "transfer_id");
  },
};
