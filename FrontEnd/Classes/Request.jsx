export default class Request{
    constructor(SerialNum ,AddressId , FromUserName , Type , DueDate,IsItPaid,Note,ExecutingUser,IsActive,skill ){
        this.requestSerialNum=SerialNum
        this.addressId=AddressId;
        this.fromUserName = FromUserName;
        this.type  = Type;
        this.dueDate=DueDate;
        this.isItPaid=IsItPaid;
        this.note=Note;
        this.executingUser=ExecutingUser;
        this.isActive=IsActive
        this.skill=skill
    }
}