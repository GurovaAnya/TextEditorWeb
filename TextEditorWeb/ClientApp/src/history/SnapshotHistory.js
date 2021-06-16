const history = []

const futureHistory = []

export function saveToHistory(snapshot){
    history.push(snapshot);
    futureHistory.splice(0, futureHistory.length);
}

export function getFromHistory(){
    let snapshot = history.pop();
    futureHistory.push(snapshot);
    return snapshot;
}

export function getFromFutureHistory(){
    let snapshot = futureHistory.pop();
    history.push(snapshot);
    return snapshot;
}