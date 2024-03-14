# todo-typescript-express

Source code for the example REST API with Express, Typescript, Sequelize and mysql

1. Clone The Repo
   ```sh
   git clone https://github.com/umer-emumba/todo-app.git
   cd todo-app
   ```
2. Install dependencies

   ```sh
   npm install
   ```

3. Setup .env.example to .env.development,.env.production or .env.test

   ```sh
   PORT=3000

   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=todo
   DB_USER=root
   DB_PASSWORD=
   ```

4. Migration Database with Sequelize

```sh
npx sequelize-cli db:migrate
```

5. Run dev

   ```sh
   npm run dev
   ```
