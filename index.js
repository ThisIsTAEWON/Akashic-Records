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
    defaultValue: 1
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

// req.body 오는 값을 읽기 위해 적용
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// <%= %> 또는 <% %> 같이 html에서 js를 쓰기위한 ejs 라이브러리
app.set('view engine', 'ejs');

// index page
app.get('/', async function(req, res) {
  res.render('index', { articles: await Articles.findAll() });
});

app.get('/article/:title', async function(req, res) {
  const article = await Articles.findOne({
    where: {
      title: req.params.title
    }
  })
  if(article===null) {
    console.log('Not found!')
  } else {
    console.log(article.updatedAt);
  }
  res.render('article', { article: article });
});

app.get('/bootstrap', async function(req, res) {
  res.render('bootstrap', { articles: await Articles.findAll() });
});

app.get('/create', async function(req, res) {
  res.render('create')
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