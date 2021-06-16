const SnapshotHistory = require("../history/SnapshotHistory")

const snapshots = [];

export function setOriginator(originator) {
    this.originator = originator
    console.log(this.originator)
    return this
}

export function createSpan(range, markerTextChar, tag) {
    let selectedIndex = this.page_content.indexOf(markerTextChar.textContent);
    console.log("selected from ", selectedIndex, "length: ", markerTextChar.textContent.length)
    let markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);
    markerEl = document.createElement(tag);
    markerEl.id = markerId;
    markerEl.appendChild(markerTextChar);
    range.insertNode(markerEl);
    return markerEl;

}

export function revertInnerStyle(closestEl, range){
    let start = new Range();
    start.setStartBefore(closestEl);
    start.setEnd(range.startContainer, range.startOffset);

    let end = new Range();
    end.setStart(range.endContainer, range.endOffset);
    end.setEndAfter(closestEl);

    let startInfo = start.extractContents();
    let endInfo = end.extractContents();

    let selectionNode = range.commonAncestorContainer;
    let curNode = selectionNode;
    if (selectionNode!==closestEl)
        while(selectionNode.parentElement!==closestEl && selectionNode.parentElement!=null){
            let markerEl, markerId = "sel_" + new Date().getTime() + "_" + Math.random().toString().substr(2);
            markerEl = document.createElement(selectionNode.parentElement.tagName);
            markerEl.style.color = selectionNode.parentElement.style.color;
            markerEl.id = markerId;
            markerEl.appendChild(curNode);
            curNode = markerEl;
            selectionNode = selectionNode.parentNode;
        }
    closestEl.replaceWith(startInfo, curNode, endInfo);
    let span = curNode;
    let pa = span.parentNode;
    while(span.firstChild) pa.insertBefore(span.firstChild, span);
    pa.removeChild(span);
}


export function applyBinaryStyle(selection, tag){
    if (selection.isCollapsed)
        return;
    let snapshot = this.originator.makeSnapshot();
    SnapshotHistory.saveToHistory(snapshot);

    this.page_content = document.getElementById('text').innerText;
    let range = selection.getRangeAt(0).cloneRange();
    let closestEl = selection.anchorNode.parentElement.closest(tag);
    let markerTextChar = range.cloneContents();

    // style needs to be applied
    if (closestEl == null) {
        range.extractContents();
        this.createSpan(range, markerTextChar, tag);
    }

    // style is already applied to text block. Revert.
    else {
        this.revertInnerStyle(closestEl, range)
    }

}

export function changeColor(color) {
    let snapshot = this.originator.makeSnapshot();
    SnapshotHistory.saveToHistory(snapshot);

    this.page_content = document.getElementById('text').innerText;
    let selection = window.getSelection();
    let range = selection.getRangeAt(0).cloneRange();
    let markerTextChar = range.extractContents();
    let markerEl = this.createSpan(range, markerTextChar, "span");
    markerEl.style.color = color;
    let children = markerEl.childNodes;
    for (let i = 0; i < children.length; i++) {
        if (children.item(i).nodeType === 1 && children.item(i).style.color !== null) {
            console.log(children.item(i));
            children.item(i).style.color = color;
        }
    }
}

export function undo() {
    let snapshot = SnapshotHistory.getFromHistory();
    if (snapshot != null)
        this.originator.restore(snapshot);
}

