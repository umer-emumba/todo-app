# todo-typescript-express

Source code for the example REST API with Express, Typescript, Sequelize and mysql

1. Clone The Repo
   ```sh
   git clone https://github.com/umer-emumba/todo-app.git
   cd todo-typescript-express
   ```
2. Install dependencies

   ```sh
   npm install
   ```

3. Setup .env.example to .env

   ```sh
   PORT=3000

   NODE_ENV=devepolment

   DB_HOST=localhost
   DB_USERNAME=mysql
   DB_PASSWORD=#setup password
   DB_PORT=5432
   DB_NAME=todo
   ```

4. Migration Database with Sequelize

   ```sh
   npx sequelize-cli db:migrate
   ```

5. Run dev

   ```sh
   npm run dev
   ```
