export class Names {

    account_name : string;
    mflow_bucket_name : string;
    ec2securitygroup : string;
    ipaddress : string
    keyname : string;
    vpcname : string;
    instancename : string;
    elasticip : string
    Ig : string;
    
    constructor( account_name : string="krvignemay152024"){
        this.mflow_bucket_name = account_name + "mflowbucket";
        this.ec2securitygroup =  account_name + "ecsecuritygroup1";
        this.ipaddress = "122.164.0.0/16";
        this.keyname = "krvignemflow";
        this.vpcname = "mflowvpcnetwork";
        this.instancename = account_name+"mflowec2instance";
        this.elasticip = "44.223.129.96";
        this.Ig = account_name + "internetgateway"


    }

}