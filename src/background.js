let originalWindowId = null;

chrome.action.onClicked.addListener((tab) => {
    // タブが元のウィンドウに存在する場合、それを新しいウィンドウに移動
    if (originalWindowId === null) {
        originalWindowId = tab.windowId;
        chrome.windows.create({ tabId: tab.id, type: 'normal', state: 'maximized' });  // stateを'maximized'に設定
    }
    // タブが新しいウィンドウに存在する場合、それを元のウィンドウに移動
    else {
        chrome.tabs.move(tab.id, { windowId: originalWindowId, index: -1 }, (movedTabs) => {
            const movedTab = Array.isArray(movedTabs) ? movedTabs[0] : movedTabs; // 結果が配列で返ってくる場合があるため、このように処理
            chrome.tabs.update(movedTab.id, { active: true }, () => {
                chrome.windows.remove(tab.windowId);
                originalWindowId = null;
            });
        });
    }
});
