const express = require("express");
const bp = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
var LocalStorage = require('node-localstorage').LocalStorage;
localStorage = new LocalStorage('./scratch');
mongoose.connect("mongodb+srv://kiran:kiran@cluster0.siuvs9s.mongodb.net/portfolio")
const app = express();
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

const port = 5000;

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    password: String
});

const dataSchema = new mongoose.Schema({
    key: String,
    certificate: [],
    intro: [],
    media: [],
    skill: [],
    type: String
});

const Linkdata = mongoose.model('Linkdata', dataSchema);
const client = mongoose.model("client", userSchema);

function generateRandomString(length) {
    const bytes = crypto.randomBytes(Math.ceil(length / 2));
    const hexString = bytes.toString('hex');
    return hexString.slice(0, length);
}

app.get("/start", function(req, res) {
    res.render("start");
});

app.get("/", (req, res) => {
    res.render("login");
});

app.get("/login", (req, res) => {
    res.render("login");
})

app.get("/signup", (req, res) => {
    res.render("signup");
})
app.get("/intro", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'intro')));
    var b, c, d, e;
    var flag = 0;
    if (a == null) {
        b = "";
        c = "";
        d = "";
        flag = 0;
    } else {
        b = a.User_name;
        c = a.user_num;
        d = a.user_mail;
        e = a.User_desc;
        flag = 516;
    }
    res.render("intro", { name: b, num: c, mail: d, desc: e, flag: flag });
});
app.get("/skill", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'skill')));
    var flag;
    if (a == null) {
        b = "";
        c = "";
        d = "";
        flag = 0;
    } else {
        b = a.skillname;
        c = a.skillstar;
        d = a.skillurl;
        flag = 516;
    }
    res.render("skill", { name: b, star: c, url: d, flag: flag });
});
app.get("/view", function(req, res) {
    res.render("view", { a: "Empty Url String" });
});
app.get("/media", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'media')));
    var flag;
    if (a == null) {
        b = "";
        c = "";
        d = "";
        flag = 0;
    } else {
        b = a.media_name;
        c = a.profile_url;
        d = a.media_pic;
        flag = 516;
    }
    res.render("media", { name: b, profile: c, media: d, flag: flag });
});
app.get("/certificate", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'certificate')));
    var flag;
    if (a == null) {
        b = "";
        c = "";
        d = "";
        flag = 0;
    } else {
        b = a.certificatename;
        c = a.platformurl;
        d = a.certificateurl;
        flag = 516;
    }
    res.render("certificate", { name: b, platform: c, url: d, flag: flag });
});
app.get("/template", function(req, res) {
    res.render("template");
});
app.get("/demo1", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'intro')));
    var b = (JSON.parse(localStorage.getItem(user + 'skill')));
    var c = (JSON.parse(localStorage.getItem(user + 'certificate')));
    var d = (JSON.parse(localStorage.getItem(user + 'media')));
    res.render("demo1", { num: a.user_num, name: a.User_name, email: a.user_mail, desc: a.User_desc, skillname: b.skillname, skillurl: b.skillurl, skillstar: b.skillstar, certiname: c.certificatename, certiurl: c.certificateurl, platformurl: c.platformurl, profile: d.profile_url, media: d.media_pic });
});
app.get("/demo2", function(req, res) {
    var user = req.cookies.port_user;
    var a = (JSON.parse(localStorage.getItem(user + 'intro')));
    var b = (JSON.parse(localStorage.getItem(user + 'skill')));
    var c = (JSON.parse(localStorage.getItem(user + 'certificate')));
    var d = (JSON.parse(localStorage.getItem(user + 'media')));
    res.render("demo2", { num: a.user_num, name: a.User_name, email: a.user_mail, desc: a.User_desc, skillname: b.skillname, skillurl: b.skillurl, skillstar: b.skillstar, certiname: c.certificatename, certiurl: c.certificateurl, platformurl: c.platformurl, profile: d.profile_url, media: d.media_pic });
});
app.get("/portfolio", function(req, res) {
    var a = (JSON.parse(localStorage.getItem('intro')));
    var b = (JSON.parse(localStorage.getItem('skill')));
    var c = (JSON.parse(localStorage.getItem('certificate')));
    var d = (JSON.parse(localStorage.getItem('media')));
    res.render("portfolio", { a: b.skillname });
});

app.get("/logout", (req, res) => {
    res.clearCookie('port_user');
    res.redirect("/login");
})

app.post("/signup", (req, res) => {
    const a = new client({
        name: req.body.username,
        mail: req.body.mail,
        password: req.body.password
    });
    a.save();
    res.redirect("/login");
})

app.post("/login", (req, res) => {
    try {
        console.log(req.body.mail);
        client.find({ mail: req.body.mail, password: req.body.password }, function(err, data) {
            console.log(data);
            if (err) console.log(err);
            else if (data != "") {
                res.cookie("port_user", req.body.mail);
                res.redirect("/start");
            } else
                res.redirect("/login");
        });
    } catch (err) {
        res.send("<h1>Error in login</h1>");
    }

});
app.post("/intropost", function(req, res) {
    var user = req.cookies.port_user;
    localStorage.setItem(user + 'intro', JSON.stringify(req.body));
    res.redirect("/skill");
});
app.post("/skillpost", function(req, res) {
    var user = req.cookies.port_user;
    localStorage.setItem(user + 'skill', JSON.stringify(req.body));
    res.redirect("/certificate");
});
app.post("/certificatepost", function(req, res) {
    var user = req.cookies.port_user;
    localStorage.setItem(user + 'certificate', JSON.stringify(req.body));
    res.redirect("/media");
});
app.post("/mediapost", function(req, res) {
    var user = req.cookies.port_user;
    localStorage.setItem(user + 'media', JSON.stringify(req.body));
    res.redirect("/template");
});

app.get("/savedata/:id", function(req, res) {
    var user = req.cookies.port_user;
    var a = localStorage.getItem(user + 'certificate');
    var b = localStorage.getItem(user + 'intro');
    var c = localStorage.getItem(user + 'media');
    var d = localStorage.getItem(user + 'skill');
    var e = req.params.id;
    console.log(user);
    const randomString = generateRandomString(10);
    console.log(randomString);
    const kir = new Linkdata({
        key: randomString,
        certificate: a,
        intro: b,
        media: c,
        skill: d,
        type: e
    });
    kir.save();
    var user = "https://portfolio-generator-i4f4.onrender.com/portfolio/" + randomString;
    var user1 = "/portfolio/" + randomString;
    res.render("view", { a: user, b: user1 });
});

app.get("/portfolio/:id", async function(req, res) {
    Linkdata.findOne({ key: req.params.id }, await
        function(err, data) {
            if (err) console.log("error in getting portfolio through link");
            else {
                try {
                    var demo = data.type;
                    var a = JSON.parse(data.intro);
                    var b = JSON.parse(data.skill);
                    var c = JSON.parse(data.certificate);
                    var d = JSON.parse(data.media);
                    //console.log(a);
                    if (demo === "1") {
                        res.render("data", { a: a, b: b, c: c, d: d });
                        //res.render("demo1", { num: a.user_num, name: a.User_name, email: a.user_mail, desc: a.User_desc, skillname: b.skillname, skillurl: b.skillurl, skillstar: b.skillstar, certiname: c.certificatename, certiurl: c.certificateurl, platformurl: c.platformurl, profile: d.profile_url, media: d.media_pic });
                    } else {
                        res.render("data1", { a: a, b: b, c: c, d: d });
                        //res.render("demo2", { num: a.user_num, name: a.User_name, email: a.user_mail, desc: a.User_desc, skillname: b.skillname, skillurl: b.skillurl, skillstar: b.skillstar, certiname: c.certificatename, certiurl: c.certificateurl, platformurl: c.platformurl, profile: d.profile_url, media: d.media_pic });
                    }
                } catch (err) {
                    res.send("Internal server error");
                }

            }
        });
});

app.listen(port, function() {
    console.log("Server started");
});
