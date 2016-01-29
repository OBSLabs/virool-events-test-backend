(function() {
  var store = { 
    events: {},
    participants: {}
  };

  var styles = {
    card: "event",
    expandedCard: "event_expanded",
    eventTitle: "event__title",
    eventHr: "event__info-hr",
    eventInfo: "event__information",
    eventParticipants: "event__participants",
    eventParticipantTitle: "event__participants-title",
    eventParticipant: "event__participant",
    eventDescContainer: "event__description-container",
    eventDesc: "event__description",
    btnExpand: "js-event__show-more"
  };

  var selfClosing = {};

  function $createElement(type, attrs, innerHtml) {
    innerHtml = innerHtml || "";
    var attrsStr = attrs && Object.keys(attrs).length ? " " : "";
    for (var prop in attrs) {
      attrsStr += prop + "=\"" + attrs[prop] + "\"";
    }

    return selfClosing[type] ? 
      ("<" + type + "/>")
      : ("<"+ type + attrsStr + ">" + innerHtml + "</"+ type + ">");
  }

  function $div(attrs, innerHtml) {
    return $createElement("div", attrs, innerHtml);
  }

  function $ul(attrs, innerHtml) {
    return $createElement("ul", attrs, innerHtml);
  }

  function $li(attrs, innerHtml) {
    return $createElement("li", attrs, innerHtml);
  }

  function $p(attrs, innerHtml) {
    return $createElement("p", attrs, innerHtml);
  }

  function $description(text) {
    return $(
      $div({
        "class": styles.eventDescContainer
      }, $p({
        "class": styles.eventDesc
      }, text))
    );
  }

  function $participants(list) {
    var $title = (list.length ? $div({
        "class": styles.eventParticipantTitle
      }, "Participants") : "");
    var $participantsList = list.length ? $ul(
      {
        "class": styles.eventParticipants
      },
      list.map(function(data) {
        return $li({
          "class": styles.eventParticipant
        }, data.name)
      })
    ) : "";

    return $(
      $title +
      $participantsList 
    );
  }

  function jsonifyResponse(res) {
    return res.json();
  }

  function getEventNumber(ctx) {
    var $card = $(ctx).parents("." + styles.card);
    return (function(number) {
      var maybeNumber = parseInt(number);
      return isNaN(maybeNumber) ? null : maybeNumber;
    })($card.attr("data-id"));
  }

  function onEdit() {
    var $elem = $(this);
    var elem = $(this).get(0);
    var _this = this;
    
    $elem.attr("contenteditable", "true");

    $(document).on("click", function(e) {
      if (e.target !== elem) {
        $elem.removeAttr("contenteditable");
        var eventNumber = getEventNumber(_this); 
        var text = $elem.text().replace(/\n/g, "").replace(/(^\s*|\s*$)/g, "");
        var description = store.events[eventNumber] ? 
          store.events[eventNumber].description : "";
        var updateUrl = "/events/" + eventNumber;
        var body = JSON.stringify({
          title: text,
          description: description
        });

        fetch(updateUrl, {
          method: "put",
          body: body,
          headers: new Headers({
            "X-CSRF-Token": $("meta[name=\"csrf-token\"]").attr("content"),
            "Content-type": "application/json"
          })
        });
        
        $(document).off("click");
      }
    });
  }


  function onFinishedResponse(ctx) {
    var $card = ctx.$card;
    var $info = ctx.$card.find("." + styles.eventInfo);
    var eventData = store.events[ctx.eventId];
    var participantsData = store.participants[ctx.eventId];

    $($div({
      "class": styles.eventHr
    })).appendTo($info); 
    $description(eventData.description).appendTo($info);
    $participants(participantsData).appendTo($info);

    $card.find("." + styles.eventTitle).on("click", onEdit);
  }

  function onResponseError(e) {
    console.error(e);
  }

  function onClick(e) {
    var $card = $(this).parents("." + styles.card);

    $card.toggleClass(styles.expandedCard);

    if ($card.hasClass(styles.expandedCard)) {
      $(this).text("(close)");
      var eventNumber = (function(number) {
        var maybeNumber = parseInt(number);
        return isNaN(maybeNumber) ? null : maybeNumber; 
      })($card.attr("data-id")); 
      var eventId;
      
      if (eventNumber && !store.events[eventNumber]) {
        var baseUrl = "/events/" + eventNumber;
        var eventDataUrl = baseUrl + ".json";
        var participantsDataUrl = baseUrl + "/participants.json";

        var eventPromise = fetch(eventDataUrl)
          .then(jsonifyResponse)
          .catch(onResponseError);
        var participantsPromise = fetch(participantsDataUrl)
          .then(jsonifyResponse)
          .catch(onResponseError);

        Promise.all([eventPromise, participantsPromise])
          .then(function(_ref) {
            var events = _ref[0];
            var participants = _ref[1];
            store.events[events.id] = events;
            store.participants[events.id] = participants;
            eventId = events.id;
            return {
              "$card": $card,
              eventId: eventId
            };
           })
           .then(onFinishedResponse)
           .catch(onResponseError);
      } else if (store.events[eventNumber]) {
        onFinishedResponse({
          "$card": $card,
           eventId: eventNumber
        });
      }
    } else {
      $(document).off("click");
      $(this).text("(expand)");
      $card.find("." + styles.eventInfo).html("");
    }
  }

  $(document).ready(function() {
    $("." + styles.btnExpand).on("click", onClick);
  });

})();
