import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import {Names} from './configuration'
import { Construct } from 'constructs';

export class Bucketcreation extends  cdk.Stack {
  constructor(scope: Construct, id: string ,props?: cdk.StackProps ) {
    super(scope, id , props);
    let n = new Names()


    new s3.Bucket(this, 'MyBucket', {
      // bucketName:n.mflow_bucket_name,
      versioned: true, // Enable versioning
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Automatically remove the bucket when the stack is deleted
    });
  }
}
