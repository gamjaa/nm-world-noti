// ==UserScript==
// @name         월드 새 글 알림
// @namespace    https://p.nmn.io/
// @iconURL      https://p.nmn.io/images/favicon/icon_world.ico?ver=20200420221054336
// @updateURL    https://github.com/gamjaa/nm-world-noti/raw/main/nm-world-noti.user.js
// @downloadURL  https://github.com/gamjaa/nm-world-noti/raw/main/nm-world-noti.user.js
// @version      0.1.210217.3
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
                var notification = new Notification('NM World Noti', {
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