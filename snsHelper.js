// // snsHelper.js
// dotenv.config();
// const AWS = require('aws-sdk');

// AWS.config.update({
//   region: 'us-east-1',
// //   accessKeyId: 'your-access-key',
// //   secretAccessKey: 'your-secret-key'
// });

// const sns = new AWS.SNS();
// module.exports.publishSubmissionToSNS = async (submission, authUserEmail) => {
//   try {
//     const snsParams = {
//       Message: JSON.stringify({
//         submission_url: submission.submission_url,
//         user_id: submission.user_id,
//         email: authUserEmail
//       }),
//       TopicArn: process.env.SNS_TOPIC_ARN,
//     };
//     const snsData = await sns.publish(snsParams).promise();
//     console.log("Submission details published to SNS", snsData);
//   } catch (error) {
//     console.error("Error publishing to SNS", error);
//   }
// };
