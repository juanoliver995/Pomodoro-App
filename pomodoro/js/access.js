let userAcces = false;

if (getUserAccessFromLS()) {
    window.location.href = './app.html';
}

function setUserAccessFromLS(userAcces) {
    try {
        localStorage.setItem('userAcces', JSON.stringify(userAcces));
    } catch (error) {
        console.error(error);
    }
}

function getUserAccessFromLS() {
    try {
        return JSON.parse(localStorage.getItem('userAcces'));
    } catch (error) {
        console.error(error);
    }
}