const loginForm = document.getElementsByClassName("login-form")[0];
const ldsRing = document.getElementsByClassName("lds-ring")[0];
const wrapper = document.querySelector('.wrapper');

async function verifyCredentials(username, password) {
    var response = await pywebview.api.login(username, password);

    return response;
}

function checkDependencies() {
    return new Promise(resolve => setTimeout(() => resolve(true), 50));
}

function processData() {
    return new Promise(resolve => setTimeout(() => resolve(true), 50));
}

function updateProgressBar(step) {
    const filler = document.querySelector('.filler');
    const circles = document.querySelectorAll('.circle');
    const leftTexts = document.querySelectorAll('.circle-text-left');
    const rightTexts = document.querySelectorAll('.circle-text-right');
    const delay = 60;

    if (step === 4) {
        filler.style.height = '100%';
    } else {
        filler.style.height = `${step * 33}%`;
    }

    for (let i = 0; i < step; i++) {
        setTimeout(() => {
            circles[i].style.backgroundColor = "#6C63FF";
            leftTexts[i].style.color = "white";
            rightTexts[i].style.color = "white";
        }, delay * i);
    }
}

async function handleLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    loginForm.style.display = "none";
    ldsRing.style.display = "inline-block";

    updateProgressBar(0.5);
    if (await verifyCredentials(username, password)) {

        updateProgressBar(1);

        (async function updateProgressSequentially() {
            await new Promise(resolve => setTimeout(resolve, 50));
    
            if (await checkDependencies()) {
                updateProgressBar(2);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
    
            if (await processData()) {
                updateProgressBar(3);
                await new Promise(resolve => setTimeout(resolve, 50));
            }
    
            updateProgressBar(4);
                

            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log(username, password)
            await pywebview.api.setCredentials({
                username: username,
                password: password
            });
            pywebview.api.launchExecutor();
            document.location.href = "home.html";
        })();
    } else {
        pywebview.api.setCredentials({});
        document.getElementById('username').value = "";
        document.getElementById('password').value = "";
        updateProgressBar(0);
        loginForm.style.display = "flex";
        ldsRing.style.display = "none";
    }
}

document.getElementById('submit').addEventListener('click', function(event) {
    event.preventDefault();
    handleLogin();
});

window.addEventListener('pywebviewready', (event) => {
    (async function () {
        var credentials = await pywebview.api.getCredentials();

        if (credentials.username && credentials.password) {
            document.getElementById('username').value = credentials.username;
            document.getElementById('password').value = credentials.password;
            handleLogin();
        }
    })()
});
