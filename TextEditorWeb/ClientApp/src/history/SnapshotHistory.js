const history = []

export function saveToHistory(snapshot){
    history.push(snapshot)
}

export function getFromHistory(){
    return history.pop();
}