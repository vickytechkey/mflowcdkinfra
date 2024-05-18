
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Names} from './configuration'
import { Construct } from 'constructs';

const app = new cdk.App();

export class Instance extends  cdk.Stack {
  constructor(scope: Construct, id: string ,props?: cdk.StackProps) {
    super(scope, id , props);
    let n = new Names()

   // default vpc
  const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true, // Lookup the default VPC
  
    });

   // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true, // Allow all outbound traffic
      securityGroupName : n.ec2securitygroup
    });

    // Add inbound rules with prefix
    securityGroup.addIngressRule(ec2.Peer.ipv4(n.ipaddress), ec2.Port.allTraffic(), 'Allow all traffic from the ip address');


     // Create the IAM role
     const role = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(), // Assume role by the account root user
      roleName: 'AdminRole', // Optional: specify a role name
    });

    // Attach AdministratorAccess policy to the role
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    const userData = ec2.UserData.forLinux();
    userData.addCommands("sudo yum install python311 -y")
    userData.addCommands("sudo yum install python3-pip -y")
    userData.addCommands("python3 -m pip install mlflow")
    userData.addCommands("mlflow server --host 0.0.0.0 --port 5000")


    // Create an EC2 instance
    const instance = new ec2.Instance(this, 'MyInstance', {
      vpc : vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE), // m5.xlarge instance type
      machineImage: new ec2.AmazonLinux2023ImageSsmParameter({
        kernel: ec2.AmazonLinux2023Kernel.KERNEL_6_1,
      }), // Using Amazon Linux AMI
      securityGroup: securityGroup, // Attach the security group
      keyName: n.keyname,
      instanceName : n.instancename,
      userData : userData
    });

    // sudo yum install python311 -y
    // sudo yum install python3-pip -y
    //python3 -m pip install mlflow
    // mlflow server --host 0.0.0.0 --port 5000
    
   
  }
}

