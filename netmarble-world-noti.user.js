// ==UserScript==
// @name         넷마블월드 새 글 알림
// @namespace    https://p.nmn.io/
// @iconURL      https://p.nmn.io/images/favicon/icon_world.ico?ver=20200420221054336
// @updateURL    https://github.com/gamjaa/netmarble-world-noti/raw/main/netmarble-world-noti.user.js
// @downloadURL  https://github.com/gamjaa/netmarble-world-noti/raw/main/netmarble-world-noti.user.js
// @version      0.1.210217.1
// @description  넷마블월드 메인을 띄워놓으면, 1분 마다 새 글을 체크해 알립니다.
// @author       gamja
// @match        https://p.nmn.io/myoffice/main/WebPartFolder/ap_ManageNotice.aspx?BoardID={000000000000000000000000006252-AA-28}
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const intervalTime = 60 * 1000;
    let lastText = null;

    if (window.Notification) {
        Notification.requestPermission();
    }

    function getBoardListInterval() {
        console.log('Run');
        document.getElementById("BoardList").innerHTML = "";

        var xmlpara = createXmlDom();
        var objNode;
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

        if (lastText != null && xmlhttp.responseText != lastText)
        {
            if (Notification.permission == 'granted') {
                var notification = new Notification('Netmarble World', {
                    icon: '/images/favicon/icon_world.ico?ver=20200420221054336',
                    body: BoardName + '에 새 글이 있습니다.',
                });
            }
        }
        lastText = xmlhttp.responseText;

        setTimeout(() => getBoardListInterval(), intervalTime);
    }

    setTimeout(() => getBoardListInterval(), intervalTime);
})();