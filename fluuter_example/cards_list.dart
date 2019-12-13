import 'package:flutter/material.dart';
import 'package:flutter_svg/flutter_svg.dart';

String cardsSVG = 'assets/cards.svg';
Widget cardsWidget =
    new SvgPicture.asset(cardsSVG, height: 128.0, semanticsLabel: 'Cards');

Widget getListViewFiles(files, onClick, onClickDel, context, _openInfoModal) {
  List<Widget> tmp = new List<Widget>();
  if (files != null)
    files.forEach((elem) {
      Widget tmpFile =
          getFileContainer(elem, onClick, onClickDel, _openInfoModal);
      tmp.add(tmpFile);
    });
  if (tmp.length == 0) {
    tmp.add(Column(
      children: <Widget>[
        Container(
          margin: EdgeInsets.only(
            top: MediaQuery.of(context).size.height * 0.2,
          ),
          padding: new EdgeInsets.symmetric(
            horizontal: MediaQuery.of(context).size.width * 0.3,
            vertical: 10,
          ),
          child: Text(
            'Please add your card',
            textAlign: TextAlign.center,
            style: TextStyle(
                fontWeight: FontWeight.normal,
                fontSize: 24,
                color: Color.fromRGBO(190, 213, 252, 1)),
          ),
        ),
        cardsWidget
      ],
    ));
  }

  return ListView(
    children: tmp,
  );
}

Widget getFileContainer(file, onClick, onClickDel, _openInfoModal) {
  var displayedName = "Credential for project | " +
      file["displayName"].toString().split("_")[1];
  return Card(
    key: ValueKey(file["displayName"]),
    elevation: 0.0,
    margin: new EdgeInsets.symmetric(horizontal: 0.0, vertical: 0),
    child: Container(
      decoration: new BoxDecoration(
          border: new Border(
              bottom: new BorderSide(width: 1.0, color: Colors.grey[100]))),
      child: ListTile(
        contentPadding: EdgeInsets.symmetric(horizontal: 18.0, vertical: 10.0),
        leading: Container(
            padding: EdgeInsets.only(right: 0.0),
            child: Hero(
                tag: "avatar_" + file["displayName"],
                child: SizedBox(
                    width: 30,
                    child: FlatButton(
                      child: Icon(
                        file["isActivated"] ? Icons.check_circle : Icons.error,
                        color: file["isActivated"] ? Colors.green : Colors.red,
                        size: 30.0,
                      ),
                      padding: EdgeInsets.all(0.0),
                      shape: new CircleBorder(),
                      onPressed: () {
                        onClick(file["fileIdHex"]);
                      },
                    )))),
        title: Container(
            margin: EdgeInsets.only(bottom: 15),
            child: Text(
              displayedName,
              style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold),
            )),
        trailing: Container(
            padding: EdgeInsets.all(0.0),
            margin: EdgeInsets.all(0.0),
            decoration: new BoxDecoration(
                border: new Border(
                    left: new BorderSide(width: 1.0, color: Colors.grey[100]))),
            child: SizedBox(
              width: 30,
              child: PopupMenuButton<String>(
                  itemBuilder: (context) => [
                        PopupMenuItem(
                            child: new InkWell(
                          onTap: () {
                            showDialog(
                                context: context,
                                builder: (context) {
                                  return AlertDialog(
                                      title: new Text(
                                          "Are you sure you want to delete file " +
                                              file["displayName"]
                                                  .toString()
                                                  .split("_")[1] +
                                              "?"),
                                      content: new Text("This will delete " +
                                          "AN: " +
                                          file["displayName"]
                                              .toString()
                                              .split("_")[0] +
                                          " file from your profile"),
                                      actions: <Widget>[
                                        new FlatButton(
                                          child: new Text("CANCEL"),
                                          onPressed: () {
                                            Navigator.of(context).pop();
                                          },
                                        ),
                                        new FlatButton(
                                          child: new Text(
                                            "DELETE",
                                            style: TextStyle(
                                                color: Colors.red[500]),
                                          ),
                                          onPressed: () {
                                            onClickDel(file["fileIdHex"]);
                                          },
                                        ),
                                      ]);
                                });
                          },
                          child: Row(
                            children: <Widget>[
                              Container(
                                  margin: EdgeInsets.only(right: 10),
                                  child: Icon(
                                    Icons.delete,
                                    color: Colors.grey[600],
                                  )),
                              Text(
                                "Delete",
                                style: TextStyle(color: Colors.grey[600]),
                              )
                            ],
                          ),
                        )),
                        PopupMenuItem(
                            child: new InkWell(
                          onTap: () => {},
                          child: Row(
                            children: <Widget>[
                              Container(
                                  margin: EdgeInsets.only(right: 10),
                                  child: Icon(Icons.edit,
                                      color: Colors.grey[600])),
                              Text(
                                "Edit",
                                style: TextStyle(color: Colors.grey[600]),
                              )
                            ],
                          ),
                        )),
                        PopupMenuItem(
                            child: new InkWell(
                          onTap: () => _openInfoModal(file),
                          child: Row(
                            children: <Widget>[
                              Container(
                                  margin: EdgeInsets.only(right: 10),
                                  child: Icon(Icons.info,
                                      color: Colors.grey[600])),
                              Text(
                                "Info",
                                style: TextStyle(color: Colors.grey[600]),
                              )
                            ],
                          ),
                        )),
                      ]),
            )),
        subtitle: Row(
          children: <Widget>[
            new Flexible(
                child: new Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: <Widget>[
                  RichText(
                    text: TextSpan(
                      text:
                          "AN: " + file["displayName"].toString().split("_")[0],
                      style: TextStyle(
                          color: Colors.blue[900], fontWeight: FontWeight.w500),
                    ),
                    maxLines: 3,
                    softWrap: true,
                  )
                ])),
          ],
        ),
      ),
    ),
  );
}
