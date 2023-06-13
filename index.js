var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Articles = sequelize.define('Articles', {
  title: {
    type: DataTypes.STRING,
    validate:{
      notEmpty: {
        args: true,
        msg: "title cannot be empty"
      }
    }
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'ㅇㅇ'
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://cdn-icons-png.flaticon.com/512/4107/4107910.png'
  },
  summary: {
    type: DataTypes.STRING,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'undefined'
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  content: {
    type: DataTypes.STRING,
    validate:{
      notEmpty: {
        args: true,
        msg: "content cannot be empty"
      }
    }
  },
});

(async() => {
await Articles.sync();
})();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs');

app.get('/', async function(req, res) {
  res.render('index', { articles: await Articles.findAll() });
});

app.get('/category/:category', async function(req, res) {
  var articles = await Articles.findAll({
    where: {
      category: req.params.category
    }
  })
  res.render('index', { articles: articles });
});

app.get('/article/:title', async function(req, res) {
  var article = await Articles.findOne({
    where: {
      title: req.params.title
    }
  })
  res.render('article', { article: article });
});

app.get('/create', async function(req, res) {
  res.render('create', {
    thumbnailManual: '/views/img/thumbnail_manual.png'
  })
});

app.post('/create', async function(req, res) {
    await Articles.create({
      title: req.body.title,
      rating: req.body.rating,
      content: req.body.content,
      summary: req.body.summary,
      username: req.body.username,
      category: req.body.category,
      thumbnail: req.body.thumbnail,
    });
    res.redirect('/')
});

app.get('/update/:title', async function(req, res) {
  res.render('update', { article: await Articles.findOne({
    where: {
      title: req.params.title
    }
  }) })
})

app.post('/update/:title', async function(req, res) {
  await Articles.update({
    title: req.body.title,
    rating: req.body.rating,
    content: req.body.content,
    summary: req.body.summary,
    username: req.body.username,
    category: req.body.category,
    thumbnail: req.body.thumbnail,
  }, {
  where: {
    title: req.params.title
  }
  });
    res.redirect(`/article/${req.body.title}`)
});

app.get('/delete/:title', async function(req, res) {
  await Articles.destroy({
    where: {
      title: req.params.title
    }
  });
    res.redirect('/')
});

app.listen(3000);
console.log('Server running');