require('dotenv').config();
const {CONNECTION_STRING} = process.env;
const Sequelize = require('sequelize');
const sequelize = new Sequelize(CONNECTION_STRING);

module.exports = {
  seed: (req, res) => {
    sequelize.query(`
    drop table if exists pokemonTeam;
    create table pokemonTeam(
      id integer primary key,
      name varchar,
      types varchar,
      image varchar
    );`).then(() => {
      console.log('DB seeded!')
      res.sendStatus(200)
  }).catch(err => console.log('error seeding DB', err))
  },
  addToTeam: (req, res) => {
    const { name, id, types, image } = req.body;
    const insertQuery = `
        INSERT INTO pokemonTeam (id, name, types, image)
        VALUES (:id, :name, :types, :image)
        RETURNING *;
    `;
    sequelize.query(insertQuery, {
        replacements: { id, name, types, image },
        type: sequelize.QueryTypes.INSERT,
    })
    .then((dbRes) => {
        res.status(200).send(dbRes[0]);
    })
    .catch(error => console.error('Error inserting Pokemon into the team:', error));
},
getTeam: (req, res) => {
  sequelize.query(`SELECT pokemonTeam.id,
  pokemonTeam.name,
  pokemonTeam.types,
  pokemonTeam.image
  FROM pokemonTeam;`)
  .then((dbRes) => {
      res.status(200).send(dbRes[0])})
      .catch(err => console.log('could not display pokemon on the team', err))
},

deleteFromTeam: (req, res) => {
  const { id } = req.params
  sequelize.query(`DELETE FROM pokemonTeam WHERE id = ${id}`)
  .then((dbRes) => {
      res.status(200).send(dbRes[0])})
  .catch(err => console.log('could not delete', err))
}

}
