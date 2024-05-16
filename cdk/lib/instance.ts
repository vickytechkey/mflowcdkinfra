
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import {Names} from './configuration'
import { Construct } from 'constructs';

export class Instance extends  cdk.Stack {
  constructor(scope: Construct, id: string ,props?: cdk.StackProps) {
    super(scope, id , props);
    let n = new Names()

   

    // const vpc = new ec2.Vpc(this, 'MyVpc', {
    //   cidr: '10.3.0.0/16',
    //   maxAzs: 2, // Use 2 Availability Zones for high availability
    //   subnetConfiguration: [
    //     {
    //       cidrMask: 24,
    //       name: 'pubsub1',
    //       subnetType: ec2.SubnetType.PUBLIC,
    //     },
    //     {
    //       cidrMask: 24,
    //       name: 'prsub1',
    //       subnetType: ec2.SubnetType.PRIVATE,
    //     },
    //   ],
    //   vpcName:n.vpcname
    // });

  const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true, // Lookup the default VPC
  
    });

    // const igw = new ec2.CfnInternetGateway(this, n.Ig );
    // const attachment = new ec2.CfnVPCGatewayAttachment(this, 'newattachment', {
    //   vpcId: vpc.vpcId,
    //   internetGatewayId: igw.ref,
    // });


    // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc: vpc,
      allowAllOutbound: true, // Allow all outbound traffic
      securityGroupName : n.ec2securitygroup
    });

    // Add inbound rules with prefix
    securityGroup.addIngressRule(ec2.Peer.ipv4(n.ipaddress), ec2.Port.tcp(80), 'Allow HTTP traffic');
    securityGroup.addIngressRule(ec2.Peer.ipv4(n.ipaddress), ec2.Port.tcp(443), 'Allow HTTPS traffic');
    securityGroup.addIngressRule(ec2.Peer.ipv4(n.ipaddress), ec2.Port.tcp(22), 'Allow SSH traffic');


     // Create the IAM role
     const role = new iam.Role(this, 'AdminRole', {
      assumedBy: new iam.AccountRootPrincipal(), // Assume role by the account root user
      roleName: 'AdminRole', // Optional: specify a role name
    });

    // Attach AdministratorAccess policy to the role
    role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess'));

    // Create an EC2 instance
    const instance = new ec2.Instance(this, 'MyInstance', {
      vpc : vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE), // m5.xlarge instance type
      machineImage: new ec2.AmazonLinuxImage(), // Using Amazon Linux AMI
      securityGroup: securityGroup, // Attach the security group
      keyName: n.keyname,
      instanceName : n.instancename
    });

    new cdk.CfnOutput(this, 'InstancePublicIp', {
      value: instance.instancePublicIp,
      description: 'Public IP address of the EC2 instance',
      exportName: 'Instace:InstancePublicIp',
    });

    
    
   
  }
}
