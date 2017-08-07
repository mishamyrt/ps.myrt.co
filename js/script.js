function ready(fn) {
  if (document.readyState != "loading") {
    fn();
  } else {
    document.addEventListener("DOMContentLoaded", fn);
  }
}
ready(function() {
  function addClass(o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    if (re.test(o.className)) return;
    o.className = (o.className + " " + c)
      .replace(/\s+/g, " ")
      .replace(/(^ | $)/g, "");
  }
  function removeClass(o, c) {
    var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
    o.className = o.className
      .replace(re, "$1")
      .replace(/\s+/g, " ")
      .replace(/(^ | $)/g, "");
  }
  var active = false;
  var searchInput = document.getElementsByClassName("search-input")[0];
  var links = document.getElementsByClassName("links")[0];
  var hoverZone = document.getElementsByClassName("hover-zone")[0];
  var items = document.getElementsByClassName("links-item");
  var itemsCount = items.length;
  var container = document.getElementsByClassName("container")[0];
  var selectedIndex = 0;
  var overScrollFlag = false;

  if (searchInput) {
    container.onclick = function(event) {
      if (searchInput.value != "") {
        if (active) {
          addClass(items[selectedIndex], "is__pulse");
          for (var i = 0; i < itemsCount; i++) {
            if (i != selectedIndex) addClass(items[i], "is__hidden");
          }
          post(
            "/getplayer",
            {
              url: items[selectedIndex].getAttribute("data-href")
            },
            function(data) {
              removeClass(items[selectedIndex], "is__pulse");
              setTimeout(function() {
                links.style.opacity = 0;
                setTimeout(function() {
                  document.body.style.background = "#000";
                  setTimeout(function() {
                    window.location.href = data.url;
                  }, 1200);
                }, 400);
              }, 300);
            }
          );
        } else {
          searchInput.blur();
          searchInput.style.opacity = 0.3;
          post(
            "/dosearch",
            {
              request: searchInput.value
            },
            function(data) {
              var html = "";
              for (var i = 0; i < data.length; i++) {
                html +=
                  '<div data-href="' +
                  data[i].url +
                  '" class="links-item">' +
                  data[i].title +
                  "</div>";
              }
              addClass(searchInput, "is__out");
              links.style.opacity = 0;
              setTimeout(function() {
                links.innerHTML = html;
                links.style.opacity = 1;
                items = document.getElementsByClassName("links-item");
                itemsCount = items.length;
                addClass(items[0], "is__selected");
                active = true;
              }, 820);
            }
          );
        }
      }
    };
  } else {
    addClass(items[0], "is__selected");
    container.onclick = function(event) {
      if (active) {
        addClass(items[selectedIndex], "is__pulse");
        for (var i = 0; i < itemsCount; i++) {
          if (i != selectedIndex) addClass(items[i], "is__hidden");
        }
        post(
          "/getplayer",
          {
            url: items[selectedIndex].getAttribute("data-href")
          },
          function(data) {
            removeClass(items[selectedIndex], "is__pulse");

            setTimeout(function() {
              links.style.opacity = 0;
              setTimeout(function() {
                document.body.style.background = "#000";
                setTimeout(function() {
                  window.location.href = data.url;
                }, 1200);
              }, 400);
            }, 300);
          }
        );
      }
    };
    hoverZone.onmouseover = function() {
      addClass(container, "is__active");
      hoverZone.style.opacity = 0;
      active = true;
    };
  }
  document.onkeydown = function(event) {
    events = event || window.event;
    if (events.keyCode == 37) {
      action("left", event);
    }
    if (events.keyCode == 39) {
      action("right", event);
    }
    if (events.keyCode == 38) {
      action("up", event);
    }
    if (events.keyCode == 40) {
      action("down", event);
    }
  };

  function action(direction, event) {
    event.preventDefault();
    switch (direction) {
      case "left":
        if (searchInput) window.location.href = "/";
        break;
      case "right":
        if (!searchInput) window.location.href = "/search/";
        break;
      case "up":
        if (active) changeSelectionToIndex(selectedIndex - 1);
        break;
      case "down":
        if (active) changeSelectionToIndex(selectedIndex + 1);
        break;
    }
  }
  function changeSelectionToIndex(index) {
    if (index >= 0 && index < itemsCount) {
      var verticalOffset = 0;
      if (
        items[index].getBoundingClientRect().top + document.body.scrollTop <
        400
      ) {
        overScrollFlag = true;
      }
      if (overScrollFlag) verticalOffset = (index - 5) * 130;
      else {
        verticalOffset = (index - 5) * 140;
      }
      if (index > 5) {
        links.style.transform = "translateY(-" + verticalOffset + "px)";
      } else {
        overScrollFlag = false;
        links.style.transform = "";
      }
      removeClass(items[selectedIndex], "is__selected");
      addClass(items[index], "is__selected");
      selectedIndex = index;
    }
  }
  function post(url, data, fn) {
    var http = new XMLHttpRequest();
    var params = serialize(data);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function() {
      if (http.readyState == 4 && http.status == 200) {
        try {
          var data = JSON.parse(http.responseText);
          fn(data);
        } catch (err) {
          console.log(http.responseText);
        }
      }
    };
    http.send(params);
  }
  serialize = function(obj, prefix) {
    var str = [],
      p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        var k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push(
          v !== null && typeof v === "object"
            ? serialize(v, k)
            : encodeURIComponent(k) + "=" + encodeURIComponent(v)
        );
      }
    }
    return str.join("&");
  };
  function insertAfter(elem, refElem) {
    var parent = refElem.parentNode;
    var next = refElem.nextSibling;
    if (next) {
      return parent.insertBefore(elem, next);
    } else {
      return parent.appendChild(elem);
    }
  }
});
