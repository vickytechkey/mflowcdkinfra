
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import {Names} from './configuration'
import { Construct } from 'constructs';

export class Rdsstack extends  cdk.Stack {
  constructor(scope: Construct, id: string , props?: cdk.StackProps) {
    super(scope, id , props);
    let n = new Names()
    const ec2InstanceIpAddress = cdk.Fn.importValue('Instace:InstancePublicIp'); // getting ec2 instance public ip
    const vpc = ec2.Vpc.fromLookup(this, 'DefaultVpc', {
      isDefault: true, // Lookup the default VPC
  
    });

    const rdsSecurityGroup = new ec2.SecurityGroup(this, 'RDSSecurityGroup', {
    vpc : vpc
      });

      rdsSecurityGroup.addIngressRule(
        ec2.Peer.ipv4(ec2InstanceIpAddress+"/32"), // Replace EC2_INSTANCE_IP_ADDRESS with the IP address of your EC2 instance
        ec2.Port.tcp(5432),
        'Allow inbound connections from EC2 instance'
      );


    
  }
}

