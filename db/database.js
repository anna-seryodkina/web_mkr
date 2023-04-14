const sqlite3 = require('sqlite3').verbose();
const app = require('express')();
const db = new sqlite3.Database('./db/students.db');


