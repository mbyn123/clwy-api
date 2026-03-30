var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
const articleRouter = require('./routes/admin/articles');
const categoryRouter = require('./routes/admin/categorys');
const settingRouter = require('./routes/admin/settings');
const userRouter = require('./routes/admin/users');
const courseRouter = require('./routes/admin/courses');
const chapterRouter = require('./routes/admin/chapters');

var app = express();

// 配置CORS
app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/admin/articles', articleRouter);
app.use('/admin/categorys', categoryRouter);
app.use('/admin/settings', settingRouter);
app.use('/admin/users', userRouter);
app.use('/admin/courses', courseRouter);
app.use('/admin/chapters', chapterRouter);

module.exports = app;
