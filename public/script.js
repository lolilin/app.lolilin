// JavaScript Document
$(document).ready(function (e) {
    /* Todo:
  • Merge this with Node.js, almost done
  • Webpages in a database/more editable version
  • Add cookies to track previous commands? (You can press up and down to browse previous commands this session)
 */
    let page = 0;
    let faviconnumber = 1;
    function favicon() {
        favicon = favicon == 1 ? 2 : 1;
        $('.favicon').attr('href', 'favicon' + favicon + ".png");
    }
    console.clear();
    let commandlist = [ /*Can be populated with various methods*/
        ["/help", "Show commands"],
        ["/clear", "Clear the console"],
    ];
    let previouscommands = [];

    let jsonString = localStorage.getItem('previouscommands');
    if (jsonString){
        previouscommands = JSON.parse(jsonString);
    }

    let inputlist = [];
    let jsoninputlist = localStorage.getItem('inputlist');
    if (jsoninputlist){
        inputlist = JSON.parse(jsoninputlist);
    }
    console.log(inputlist);


    let currentcommand = 0;
    let pages = [ /*Can be populated with various methods*/
        ["index", "Welcome to Koya.io", "Simply, this is just a sandbox in which to add to; no real point - a couple of features that I plan to add though:", "URL shortner and open tracker, just enter a URL into the command line and press enter and you will get 2 links - 1 which looks like [http://koya.io/XXXXXX](http://koya.io/XXXXXX) and another [http://koya.io/u/XXXXXX](http://koya.io/u/XXXXXX) : they will both forward but the second will show a preview of the full url so they know where you are going.", "You can also save small messages with `/msg <string <160 chars>` and you will get a url like [http://koya.io/XXXXXX](http://koya.io/XXXXXX)", "Pressing Ctrl+v will paste the short text or image and you will get a link.", "There will be accounts but likely given out rather than being able to register them whenever, this is a personal site so idk."],
        ["about", "About Koya.io", "Personal power website for Finn 'Koya' Shackleton.", "Will include some features which too are mainly for personal use: Link shortner, image host, pastebin and any sandbox testing", "The colours have been taken from [https://github.com/Poorchop/darktooth-theme-ports/tree/8c852e8edde8df57d831dc8631493b0565fadbbc/hexchat-darktooth](Poorchop's Darktooth HexChat theme)", "In the process of turning the website into a server sided thing, currently what you can read is in the [http://koya.io/scripts.js](JavaScript file)!"],
        ["connect", "Connect with Koya",
            "[mailto:_@koya.io](Email _@koya.io)",
            "[skype:finn.shackleton](Skype)",
            "[^http://steamcommunity.com/id/bananabutterscotchmaplepancakes](Steam) < Always available",
            "[^https://codepen.io/OfficialAntarctica](Codepen)",
            "[^http://everybodyedits.com/profiles/bbmp](Everybody Edits)"]
    ];
    let pageindex = ["index", "about", "connect"];
    let currentpage = "landing";
    let url = "http://cmd.lolis.fyi/"
    /*
       Custom Text Syntax
       Links:      
          [URLPATH](NAME) - regular
          [^URLPATH](NAME) - open in new tab
          
       Styles:
          *TEXT* - bold text
          E! - Text is an error/notification
          A! - spaces are converted to non-breaking spaces (it's for ascii art - after all, this is a text based website)
    */

    function init() {
        setInterval(time);
        // console.clear();
        console.log(new Date().getTime());
        log("Website", "A! _____ _____ __ __ _____ ");
        log("Website", "A!|  |  |     |  |  |  _  |");
        log("Website", "A!|    -|  |  |_   _|     |");
        log("Website", "A!|__|__|_____| |_| |__|__|");
        log("Website", '[^http://lolilin.com/](*lolilin.com*)');
        log("Website", "");
        // log("Website", "E!I'm no longer using this at [^http://koya.io/](*Koya.io*)");
        // log("Website", "");
        log("Website", "You are currently on page: *" + 'login' + "*");
        log("Client", "For help say '/login' and '/connect'");
        setInterval(favicon, 500);
    }




    function log(name, information) {
        let d = new Date();
        let hours = ((d.getHours() < 10) ? "0" : "") + d.getHours();
        let minutes = ((d.getMinutes() < 10) ? "0" : "") + d.getMinutes();
        let seconds = ((d.getSeconds() < 10) ? "0" : "") + d.getSeconds();
        let colour = "whitet";
        let textcolour = "";
        let postcolour = "";

        switch (name[0]) {
            case "!":
                postcolour = " important";
                name = name.substr(1);
                break;
        }
        switch (name) {
            case "Website":
                colour = "redt";
                break;
            case "Server":
                colour = "bluet";
                break;
            case "Client":
                colour = "bluet";
                break;
            case "User":
                colour = "greent";
                postcolour = " selft";
                break;
        }
        if (information[0] == "A" && information[1] == "!") {
            information = information.substr(2);
            information = information.replace(/ /g, '\u00A0');
        }
        if (information[0] == "E" && information[1] == "!") {
            information = information.substr(2);
            postcolour = " important";
        }

        while (information.indexOf("](") >= 0) { //URL parser

            let NAMEregExp = /\(([^)]+)\)/;
            let uname = NAMEregExp.exec(information)[1];

            let URLregExp = /\[([^)]+)\]/;
            let url = URLregExp.exec(information)[1];
            let newpage = false;
            if (url[0] == "^") {
                newpage = true;
                url = url.substr(1);
            }
            let start = information.indexOf("[");
            let end = information.indexOf(")");
            if (newpage) {
                information = information.replace(information.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '" target="_blank">' + uname + '</a>');
            } else {
                information = information.replace(information.substring(start, end + 1), "").splice(start, 0, '<a href="' + url + '">' + uname + '</a>');
            }
            //information = '<a href="' + url + '">' + uname + '</a>'; //working

        }
        let tobold = true;
        let boldnumber = 0;
        for (let i = 0; i < information.length; i++) {
            if (information[i] == "*" && information[i - 1] != "*" && information[i + 1] != "*") {
                boldnumber++;
            }
        }
        while (information.indexOf("*") >= 0) { //Bold parser
            let pos = information.indexOf("*");
            information = information.replace("*", "");
            if (tobold) {
                information = information.splice(pos, 0, '<b>');
            } else {
                information = information.splice(pos, 0, '</b>');
            }
            tobold = !tobold;
            if (tobold && boldnumber <= 1) {
                break;
            }
            //information = '<a href="' + url + '">' + uname + '</a>'; //working
        }
        let tounderline = true;
        let underlinenumber = 0;
        for (let i = 0; i < information.length; i++) {
            if (information[i] == "*" && information[i - 1] != "*" && information[i + 1] != "*") {
                underlinenumber++;
            }
        }
        while (information.indexOf("**") >= 0) { //Bold parser
            let pos = information.indexOf("**");
            information = information.replace("**", "");
            if (tounderline) {
                information = information.splice(pos, 0, '<u>');
            } else {
                information = information.splice(pos, 0, '</u>');
            }
            tounderline = !tounderline;
            if (tounderline && underlinenumber <= 1) {
                break;
            }
            //information = '<a href="' + url + '">' + uname + '</a>'; //working
        } /**/
        $(".stream").append('<div class="line">' +
            '<p class="time">[' + hours + ":" + minutes + ":" + seconds + ']</p>' +
            '<p class="name ' + colour + '">' + name + '</p>' +
            '<p class="information' + postcolour + '">' + information + '</p>' +
            '</div>');
        $(document).scrollTop($(document).height() - $(window).height());
    }
    let timestring = "";
    function time() {
        let d = new Date();
        let hours = d.getHours();
        let minutes = d.getMinutes();
        let seconds = d.getSeconds();
        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        let temptimestring = "[" + hours + ":" + minutes + ":" + seconds + "]";
        if (temptimestring != timestring) {
            timestring = temptimestring;
            $(".editline .time").text(timestring);
        }
    }

    let wssend = '';
    let ws = ''
    function wsconnect(){
        const token = localStorage.getItem('token');
        if (token){
            page = 1
            ws = new WebSocket("wss://api.lolis.fyi/app/cmd/ws/" + token);
            wsmessage()
            
            for (let data in inputlist) {
                log(inputlist[data]['Method'],inputlist[data]['msg']);
                rollBottom();
            }
        }else{
            log("Server", "E![CONNECT] No LOGIN please '/login'");
        }
    }
    // setInterval(, 0);


    function rollBottom(){
        var t = document.documentElement.clientHeight; 
        window.scroll({ top: t, left: 0 });
    }
    

    function wsmessage(){
        ws.onmessage = function(event) {
            let data = JSON.parse(event.data);

            if (data["Method"] != 'Client'){
                inputlist.push(data);

                var inputjsonString = JSON.stringify(inputlist);
                localStorage.setItem('inputlist',inputjsonString)
            }

            if (data["Method"] == 'CLOSE'){
            log("Server", "E![CONNECT] Disconnect");
            }else
            {
                log(data['Method'],data['msg']);
            }
            rollBottom();

        };
    }
    let awdawd = [282,240]
    let ctrldown = false;
    $(".editline .edit").keyup(function (e) {
        let text = $(".editline .edit").text();
        // console.log(e.which);
        if (e.which == 13 && text !== "" && !ctrldown) {
            let commands = text.split(' ');
            let output = "";
            if (commands[0] == "help") {
                text = "/" + text;
            }
            $(".editline .edit").text("");
            log("User", text);
            wssend = text
            previouscommands[currentcommand] = text;

            var jsonpreviouscommands = JSON.stringify(previouscommands);
            localStorage.setItem('previouscommands', jsonpreviouscommands);

            currentcommand = previouscommands.length;
            // $(".editline .edit").trigger(35);
            cmd(commands[0], text, commands);
            /*Add mod commands*/
            //modcmd(commands[0], text, commands);
            /*Add mod commands*/
        }
        if (e.which == 17) { //up
            ctrldown = false

        }
        if (e.which == 38) { //up
            if (currentcommand > 0) {
                currentcommand--;
                $(".editline .edit").text(previouscommands[currentcommand]);
            }
        }
        if (e.which == 40) { //down

            if (currentcommand < previouscommands.length) {
                currentcommand++;
                $(".editline .edit").text(previouscommands[currentcommand]);
            }
        }
    });
    $(".editline .edit").keydown(function (e) {
        let text = $(".editline .edit").text();
        // console.log(e.which);

        if (e.which == 17) { //up
            ctrldown = true

        }
    });

    
    function sendMessage(event) {
        ws.send(wssend)
        // event.preventDefault()
    }

    function cmd(command, words, word) {
        if (page==1){
            switch (word[0]) {
                case "/webclose":
                    ws.close()
                    page = 0
                    $(".stream").text("");
                    init()
                    log("Server", "E![CONNECT] Disconnect");
                    break;
                case "/start":
                case "start":
                    wssend = 'start'
                    sendMessage()
                    break;
                case "/stop":
                case "stop":
                    wssend = 'stop'
                    sendMessage()
                    break;
                default:
                    sendMessage()
            }
        }else{
            switch (word[0]) {
                case "/help":
                case "help":
                    for (let i = 0; i < commandlist.length; i++) {
                        output = commandlist[i][0] + " : " + commandlist[i][1];
                        //console.log(command[i][0]);
                        log("Client", output);
                    }
                    break;
                case "/clear":
                case "clear":
                    $(".stream").text("");
                    break;
                case "/login":
                    if (word.length >= 3) {
                        log("Client", "Attempting to login to " + word[1] + " with " + Array(word[2].length + 1).join("*"));
                        loginreturn = false;
                        //log("Client", "ER1");
                        setTimeout(loginemptyreturn(word[1],word[2]), 200);
                    } else {
                        log("Client", "Not enough arguments to log in, you need a USERNAME and a PASSWORD.");
                    }
                    break;
                case "/connect":
                    wsconnect();
                    break;
                default:
                    output = "Unrecognised command '" + word[0] + "'.";
                    log("Client", output);
            } 
        }
    }

    let loginreturn = false;

    function loginemptyreturn(user,pwd) {
        //log("Client", "ER2");
        if (!loginreturn) {
            axios.post('https://api.lolis.fyi/app/cmd/login',
                {
                    "user": user,
                    "password": pwd
                }
            )
            .then(function (dat) {
                log("Server", "E![LOGIN] SUCCESS");
                localStorage.setItem('token',dat.data['ws'])
            })
            .cauth(function () {
                log("Server", "E![LOGIN] No USER or PASSWORD");
            });
            // log("Client", "E![LOGIN] No Return Recieved");
        }
    }
    
    String.prototype.splice = function (idx, rem, str) {
        return this.slice(0, idx) + str + this.slice(idx + Math.abs(rem));
    };
    init();
    log('Client','')
    wsconnect()
});