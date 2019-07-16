//connect
/*(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||
    []).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)
        [0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
(window, document, "script", "http://us-bitrix/m-app-debug.js", "mad")*/

(function (window) {
    function MAppDebugger() {
        this.container = null;
        this.block = null;
        this.tmp={};
        this.storage = window.localStorage;
    }

    MAppDebugger.prototype.init = function () {
        this._addDebuggerBlock();
        this.initEvents();
        //setTimeout(this.initEvents.bind(this),30);
    };

    MAppDebugger.prototype._addDebuggerBlock = function () {
        var div = document.createElement('div');
        div.className='';
        div.innerHTML = `
<div class="m-app-debug">
    <div class="m-app-debug__icon"></div>
    <div class="m-app-debug__menu">
        <div class="m-app-debug__menu-item m-app-refresh">Обновить</div>
        <div class="m-app-debug__menu-item m-app-support-team">Написать в ТП</div>
    </div>
</div>
<style>
    .m-app-debug {
        position: fixed;
        z-index: 10010000000;
        left: -11px;
        bottom: 200px;
        padding: 5px;
        border: 1px solid #b3b3b3;
        border-left: none;
        border-radius: 0 50% 50% 0;
        background: white;
        /*transition-duration: 50ms;*/
    }
    
    .m-app-debug__icon {
        width: 15px;
        height: 15px;
        position: relative;
        z-index: 1002;
    
        background: white url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCINCgkgdmlld0JveD0iMCAwIDUxMi4wMSA1MTIuMDEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMi4wMSA1MTIuMDE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xKSI+DQoJPGc+DQoJCTxnPg0KCQkJPHBhdGggZD0iTTUwOC41MTcsMjU3LjAyN2wtMTA2LjQ0NS01Ny4zMTh2LTIwLjUwNmMwLTQuNzEtMy44MTQtOC41MzMtOC41MzMtOC41MzNoLTI1LjZ2LTguNTMzDQoJCQkJYzAtNi41NjItMC42ODMtMTIuOTYyLTEuNzgzLTE5LjIxN2w1Ni4zNDYtMjQuMTQxYzMuMTQtMS4zNCw1LjE3MS00LjQyOSw1LjE3MS03Ljg0MlYxNy4wN2g1MS4yDQoJCQkJYzQuNzE5LDAsOC41MzMtMy44MjMsOC41MzMtOC41MzNzLTMuODE0LTguNTMzLTguNTMzLTguNTMzaC01OS43MzNjLTQuNzE5LDAtOC41MzMsMy44MjMtOC41MzMsOC41MzN2OTYuNzc3bC00OC43NTEsMjAuODk4DQoJCQkJYy03Ljg1OS0yMi44NTItMjIuODg2LTQyLjM3Ny00Mi40OTYtNTUuNzU3YzguNzEzLTYuMTg3LDE0LjQ0Ny0xNi4zMDcsMTQuNDQ3LTI3Ljc4NGMwLTE4LjgyNS0xNS4zMDktMzQuMTMzLTM0LjEzMy0zNC4xMzMNCgkJCQljLTQuNzE5LDAtOC41MzMsMy44MjMtOC41MzMsOC41MzNzMy44MTQsOC41MzMsOC41MzMsOC41MzNjOS40MTIsMCwxNy4wNjcsNy42NTQsMTcuMDY3LDE3LjA2Nw0KCQkJCWMwLDkuNDEyLTcuNjU0LDE3LjA2Ny0xNy4wNjcsMTcuMDY3Yy0wLjAxNywwLTAuMDI2LDAuMDA5LTAuMDQzLDAuMDA5Yy0xMy4xMzMtNS40ODctMjcuNTI5LTguNTQyLTQyLjYyNC04LjU0Mg0KCQkJCXMtMjkuNDkxLDMuMDU1LTQyLjYyNCw4LjU0MmMtMC4wMTcsMC0wLjAyNi0wLjAwOS0wLjA0My0wLjAwOWMtOS40MTIsMC0xNy4wNjctNy42NTQtMTcuMDY3LTE3LjA2Nw0KCQkJCWMwLTkuNDEyLDcuNjU0LTE3LjA2NywxNy4wNjctMTcuMDY3YzQuNzE5LDAsOC41MzMtMy44MjMsOC41MzMtOC41MzNzLTMuODE0LTguNTMzLTguNTMzLTguNTMzDQoJCQkJYy0xOC44MjUsMC0zNC4xMzMsMTUuMzA5LTM0LjEzMywzNC4xMzNjMCwxMS40NzcsNS43MzQsMjEuNTk4LDE0LjQ0NywyNy43ODRjLTE5LjYxLDEzLjM4LTM0LjYzNywzMi45MDUtNDIuNDk2LDU1Ljc1Nw0KCQkJCWwtNDguNzUxLTIwLjg5OFY4LjUzN2MwLTQuNzEtMy44MTQtOC41MzMtOC41MzMtOC41MzNIMzUuMTM4Yy00LjcxOSwwLTguNTMzLDMuODIzLTguNTMzLDguNTMzczMuODE0LDguNTMzLDguNTMzLDguNTMzaDUxLjINCgkJCQl2OTMuODY3YzAsMy40MTMsMi4wMzEsNi41MDIsNS4xNzEsNy44NDJsNTYuMzQ2LDI0LjE0MWMtMS4xMDEsNi4yNTUtMS43ODQsMTIuNjU1LTEuNzg0LDE5LjIxN3Y4LjUzM2gtMjUuNg0KCQkJCWMtNC43MTksMC04LjUzMywzLjgyMy04LjUzMyw4LjUzM3YyMC41MDZMNS40OTQsMjU3LjAyN2MtNC4xNDcsMi4yMjctNS43MDksNy40MDctMy40NzMsMTEuNTU0DQoJCQkJYzEuNTQ1LDIuODY3LDQuNDg5LDQuNDg5LDcuNTI2LDQuNDg5YzEuMzY1LDAsMi43NDgtMC4zMjQsNC4wMzYtMS4wMjRsMTA4Ljc2Ni01OC41NjRsMTM0LjY3Myw3NS40MThsMTM1LjIwMi03NS4xMQ0KCQkJCWwxMDguMjAzLDU4LjI1N2MxLjI4OSwwLjcsMi42NzEsMS4wMjQsNC4wMzYsMS4wMjRjMy4wMzgsMCw1Ljk4Mi0xLjYyMSw3LjUyNi00LjQ4OQ0KCQkJCUM1MTQuMjI1LDI2NC40MzQsNTEyLjY2NCwyNTkuMjU1LDUwOC41MTcsMjU3LjAyN3ogTTM1MC44NzIsMTcwLjY3SDE2My4xMzh2LTguNTMzYzAtNTEuNzU1LDQyLjExMi05My44NjcsOTMuODY3LTkzLjg2Nw0KCQkJCWM1MS43NTUsMCw5My44NjcsNDIuMTEyLDkzLjg2Nyw5My44NjdWMTcwLjY3eiIvPg0KCQkJPHBhdGggZD0iTTQ1MC4yMDgsMzQzLjMybC00OC4xMzYtNDAuMTE1di03NS4zNjZsLTEzNi41MzMsNzUuODUzdjE3My43NDdjNzYuMDE1LTQuNDU0LDEzNi41MzMtNjcuNTI0LDEzNi41MzMtMTQ0LjYzMnYtNy4zODENCgkJCQlsMzIuMjA1LDI2LjgzN2wtMzkuOTcsODcuOTQ1Yy0xLjEzNSwyLjQ5Mi0wLjk5OCw1LjM4NSwwLjM1OCw3Ljc2NWwzNC4xMzMsNTkuNzMzYzEuNTcsMi43NTYsNC40NDYsNC4zMDEsNy40MTUsNC4zMDENCgkJCQljMS40MzQsMCwyLjg5My0wLjM2Nyw0LjIyNC0xLjEyNmM0LjA5Ni0yLjMzOCw1LjUyMS03LjU1MiwzLjE3NC0xMS42NDhsLTMxLjk2Ni01NS45MzZsNDAuODU4LTg5Ljg5OQ0KCQkJCUM0NTQuMSwzNDkuODk5LDQ1My4xNTIsMzQ1Ljc3Nyw0NTAuMjA4LDM0My4zMnoiLz4NCgkJCTxwYXRoIGQ9Ik0xMTEuOTM4LDMwMy4yMDVMNjMuODAyLDM0My4zMmMtMi45NDQsMi40NTgtMy44OTEsNi41NzktMi4yOTUsMTAuMDc4bDQwLjg1OCw4OS44OTlsLTMxLjk2Niw1NS45MzYNCgkJCQljLTIuMzQ3LDQuMDk2LTAuOTIyLDkuMzEsMy4xNzQsMTEuNjQ4YzEuMzMxLDAuNzU5LDIuNzksMS4xMjYsNC4yMjQsMS4xMjZjMi45NywwLDUuODQ1LTEuNTQ1LDcuNDE1LTQuMzAxbDM0LjEzMy01OS43MzMNCgkJCQljMS4zNTctMi4zODEsMS40OTMtNS4yNzQsMC4zNTgtNy43NjVsLTM5Ljk3LTg3Ljk0NWwzMi4yMDUtMjYuODM3djcuMzgxYzAsNzcuMTA3LDYwLjUxOCwxNDAuMTc3LDEzNi41MzMsMTQ0LjYzMlYzMDMuNjc0DQoJCQkJbC0xMzYuNTMzLTc2LjQ1OVYzMDMuMjA1eiIvPg0KCQk8L2c+DQoJPC9nPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPC9zdmc+DQo=');
        background-size: contain;
    }
    
    .m-app-debug:hover {
        left: 0;
        padding: 10px;
    }
    
    .m-app-debug:hover .m-app-debug__icon {
        width: 20px;
        height: 20px;
    }
    
    .m-app-debug__menu {
        display: none;
        position: absolute;
        left: 100%;
        top: -50%;
    }
    
    .m-app-debug__menu-item {
        background: white;
        border: 1px solid #c6c6c6;
        border-radius: 13px;
        padding: 1px 10px;
        white-space: nowrap;
        margin: 5px 5px;
    }
    
    .m-app-debug:hover .m-app-debug__menu {
        display: block;
    }
</style>
`;

        var b = document.body;
        if (!b) {
            b = document;
        }
        this.container = div;
        this.block = div.querySelector('.m-app-debug');
        var dy = this.storage.getItem('m-app-debug--bottom');
        if (!dy)
            dy = 0;
        this._setBlockBottom(200-dy);
        b.appendChild(div);
    };

    MAppDebugger.prototype.initEvents = function () {
        /*this.block.addEventListener('mousedown',function (e) {
            console.log(e);
        }.bind(this), false);
        this.block.addEventListener('mouseup',function (e) {
            console.log(e);
        }.bind(this), false);
        this.block.addEventListener('mousemove',function (e) {
            console.log(e);
        }.bind(this), false);*/

        this.block.querySelector('.m-app-refresh').addEventListener('click',function (e) {
            window.location.reload(true);
        }.bind(this), false);

        this.block.querySelector('.m-app-support-team').addEventListener('click',function (e) {
            alert('Написать в ТП пока невозможно');
        }.bind(this), false);

        this.block.addEventListener('touchstart',this._touchStart.bind(this), false);
        this.block.addEventListener('touchend',this._touchEnd.bind(this), false);
        this.block.addEventListener('touchmove',this._touchMove.bind(this), false);
    };

    MAppDebugger.prototype._touchStart = function (e) {
        if (e.touches.length===0)
            return;
        this.tmp.touchStartY = e.touches[0].clientY;
        this.tmp.blockBottom = this.blockBottom;
    };

    MAppDebugger.prototype._touchEnd = function (e) {
        this.storage.setItem('m-app-debug--bottom', 200-this.tmp.blockBottom);
    };

    MAppDebugger.prototype._touchMove = function (e) {
        if (e.touches.length===0)
            return;
        var dy = e.touches[0].clientY - this.tmp.touchStartY;
        this._setBlockBottom(this.tmp.blockBottom-dy);
    };

    MAppDebugger.prototype._setBlockBottom = function (y) {
        this.blockBottom = y;
        this.block.style.bottom=(y)+'px';
    };

    var mAppDebugger = new MAppDebugger();
    mAppDebugger.init();
})(window);
