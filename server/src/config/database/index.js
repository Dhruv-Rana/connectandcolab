const dbIp = process.env.ENV === 'dev' ? 'localhost' : '127.0.0.1'
const dbPort = 27017

const databaseConfiguration = {}

// DATABASE NAME
// databaseConfiguration.dbName = 'ms_e_server'
databaseConfiguration.dbName = 'ms_e_server_test'

// DATABASE COLLECTION NAMES
databaseConfiguration.companyCollection = 'company_collection'
databaseConfiguration.eventCollection = 'event_collection'
databaseConfiguration.raffleCollection = 'raffle_collection'
databaseConfiguration.oldTicketCollection = 'old_ticket_collection'
databaseConfiguration.retailerCollection = 'retailer_collection'
databaseConfiguration.userCollection = 'user_collection'
databaseConfiguration.ticketCollection = 'ticket_collection'
databaseConfiguration.transactionCollection = 'transaction_collection'
databaseConfiguration.retailerDisputeCollection = 'retailer_dispute_collection'
databaseConfiguration.utilityCollection = 'utility_collection'

// DATABASE CONNECTION
databaseConfiguration.dbURI = `mongodb://${dbIp}:${dbPort}/${databaseConfiguration.dbName}`

module.exports = databaseConfiguration
