var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

const adminAuth = require('./middlewares/admin-auth');
const userAuth = require('./middlewares/user-auth');

require('dotenv').config();


const adminArticleRouter = require('./routes/admin/articles');
const adminCategoryRouter = require('./routes/admin/categorys');
const adminSettingRouter = require('./routes/admin/settings');
const adminUserRouter = require('./routes/admin/users');
const adminCourseRouter = require('./routes/admin/courses');
const adminChapterRouter = require('./routes/admin/chapters');
const adminChartRouter = require('./routes/admin/charts');
const adminAuthRouter = require('./routes/admin/auth');

const homeRouter = require('./routes/home');
const categoriesRouter = require('./routes/categories');
const coursesRouter = require('./routes/courses');
const chaptersRouter = require('./routes/chapter');
const articlesRouter = require('./routes/articles');
const settingsRouter = require('./routes/settings');
const searchRouter = require('./routes/search');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');

var app = express();

// 配置CORS
app.use(cors());


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin/articles', adminAuth, adminArticleRouter);
app.use('/admin/categorys', adminAuth, adminCategoryRouter);
app.use('/admin/settings', adminAuth, adminSettingRouter);
app.use('/admin/users', adminAuth, adminUserRouter);
app.use('/admin/courses', adminAuth, adminCourseRouter);
app.use('/admin/chapters', adminAuth, adminChapterRouter);
app.use('/admin/charts', adminAuth, adminChartRouter);
app.use('/admin/auth', adminAuthRouter);

app.use('/home', userAuth, homeRouter);
app.use('/categories', userAuth, categoriesRouter);
app.use('/courses', userAuth, coursesRouter);
app.use('/chapters', userAuth, chaptersRouter);
app.use('/articles', userAuth, articlesRouter);
app.use('/settings', userAuth, settingsRouter);
app.use('/search', userAuth, searchRouter);
app.use('/auth', authRouter);
app.use('/users', userAuth, usersRouter);



module.exports = app;