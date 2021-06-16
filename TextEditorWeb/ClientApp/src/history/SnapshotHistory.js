const history = []

const futureHistory = []

export function saveToHistory(snapshot){
    history.push(snapshot);
    futureHistory.splice(0, futureHistory.length);
}

export function getFromHistory(current){
    futureHistory.push(current)
    let snapshot = history.pop();
    return snapshot;
}

export function getFromFutureHistory(current){
    history.push(current);
    let snapshot = futureHistory.pop();
    return snapshot;
}

export function saveToFutureHistory(snapshot){
    futureHistory.push(snapshot);
}