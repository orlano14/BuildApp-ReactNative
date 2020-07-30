export default class RequestToPush{
    constructor(FromUserName , Type , DueDate,Note,IsItPaid,requestLong,skill ){
        this.fromUserName = FromUserName;
        this.type  = Type;
        this.dueDate=DueDate;
        this.note=Note;
        this.isItPaid=IsItPaid;
        this.requestLong=requestLong;
        this.skill=skill;
    }
}