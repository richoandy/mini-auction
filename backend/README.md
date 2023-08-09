# Auction Backend Service #
## demonstration on Clean Architecture for Typescript: ##
- Object Oriented
- fat usecase, slim repository, slim delivery, 
- usecase should not interact with any 3rd party library dependencies
- "only test code that I write"

**stack**:
- Web Framework: *Express (@types/express)*
- ORM: *TypeORM*
- Database: *Postgresql*
- Container and Orhcestration: Docker and Docker-Compose
- Encryptor: Bcrypt
- Session Management: JSON-Web-Token
- Validator and Documentation: Open API Validator (and Swagger)

**Backend To Do**:
1. docker-compose up: start up postgresql docker container
2. npm run migration:up: migrate the tables
3. npm run dev: start express application to start accepting http requests
4. npm run start-cron: start cron jobs intance to run scheduler to finalize bids that has passed assigned time-period

