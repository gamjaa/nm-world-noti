// ==UserScript==
// @name         월드 새 글 알림
// @namespace    https://p.nmn.io/
// @iconURL      https://p.nmn.io/images/favicon/icon_world.ico?ver=20200420221054336
// @updateURL    https://github.com/gamjaa/nm-world-noti/raw/main/nm-world-noti.user.js
// @downloadURL  https://github.com/gamjaa/nm-world-noti/raw/main/nm-world-noti.user.js
// @version      1.0.210222
// @description  월드 첫페이지를 띄워놓으면, 1분 마다 새 글을 체크해 알립니다.
// @author       gamja
// @match        https://p.nmn.io/myoffice/main/WebPartFolder/ap_ManageNotice.aspx?*
// @match        https://p.nmn.io/myoffice/main/WebPartFolder/cp_enotice.aspx?*
// @match        https://p.nmn.io/myoffice/main/WebPartFolder/cp_cforcus.aspx?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const intervalTime = 60 * 1000;
    let lastItems = [];

    if (window.Notification) {
        Notification.requestPermission();
    }

    function getBoardListInterval() {
        document.getElementById("BoardList").innerHTML = "";

        const xmlpara = createXmlDom();
        let objNode;
        createNodeInsert(xmlpara, objNode, "PARAMETER");
        createNodeAndInsertText(xmlpara, objNode, "BoardID", pBoardID);
        createNodeAndInsertText(xmlpara, objNode, "CompanyBoardID", pCompanyBoard);
        createNodeAndInsertText(xmlpara, objNode, "DeptBoardID", pDeptBoardID);
        createNodeAndInsertText(xmlpara, objNode, "NewsBoardID", pNewsBoardID);

        xmlhttp = null;
        xmlhttp = createXMLHttpRequest();
        xmlhttp.open("POST", "aspx/Get_ManageNotice.aspx", true);
        xmlhttp.onreadystatechange = onReadyStateChange;
        xmlhttp.send(xmlpara);
    }

    function onReadyStateChange() {
        getBoardList_after();

        if (xmlhttp == null || xmlhttp.readyState != 4) return;

        const xml = xmlhttp.responseXML;
        const rows = xml.getElementsByTagName("ROW");
        const rowCount = rows.length;
        const currentItems = [];
        const titles = [];

        for (let i = 0; i < rowCount; i++) {
            const value = rows.item(i).getElementsByTagName("VALUE");
            const itemID = value.item(0).textContent;
            const title = pBoardID == '{FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF}' ? value.item(3).textContent : value.item(2).textContent;
            currentItems.push(itemID);
            titles.push(title);
        }

        if (lastItems.length != 0) {
            for (let i = 0; i < rowCount; i++) {
                const itemID = currentItems[i];

                if (!lastItems.includes(itemID)) {
                    if (Notification.permission == 'granted') {
                        var notification = new Notification(`${BoardName} 새 글 알림`, {
                            icon: '/images/favicon/icon_world.ico?ver=20200420221054336',
                            body: titles[i],
                        });
                        notification.onclick = ev => {
                            ev.preventDefault();
                            openDoc(itemID)
                        };
                    }
                }
            }
        }

        lastItems = currentItems;

        setTimeout(() => getBoardListInterval(), intervalTime);
    }

    setTimeout(() => getBoardListInterval(), intervalTime);
})();