// This Jenkinsfile uses the declarative syntax. If you need help, check:
// Overview and structure: https://jenkins.io/doc/book/pipeline/syntax/
// For plugins and steps:  https://jenkins.io/doc/pipeline/steps/
// For Github integration: https://github.com/jenkinsci/pipeline-github-plugin
// For credentials:        https://jenkins.io/doc/book/pipeline/jenkinsfile/#handling-credentials
// For credential IDs:     https://ci.ts.sv/credentials/store/system/domain/_/
// Docker:                 https://jenkins.io/doc/book/pipeline/docker/
// Custom commands:        https://github.com/Tradeshift/jenkinsfile-common/tree/master/vars
// Environment variables:  env.VARIABLE_NAME

pipeline {
    agent any // Or you could make the whole job or certain stages run inside docker
    triggers {
        issueCommentTrigger('^(retest|docker push)$')
    }
    options {
        ansiColor('xterm')
        timestamps()
        timeout(time: 60, unit: 'MINUTES') // Kill the job if it gets stuck for too long
        buildDiscarder(logRotator(numToKeepStr: '50', artifactNumToKeepStr: '50'))
    }
    // For Java people
    // tools {
    //    jdk 'oracle-java10.0.1-jdk'
    //    maven 'apache-maven-3.5.0'
    // }
    // environment {
    //     P12_PASSWORD = credentials 'client-cert-password'
    //     MAVEN_OPTS = "-Djavax.net.ssl.keyStore=/var/lib/jenkins/.m2/certs/jenkins.p12 \
    //                   -Djavax.net.ssl.keyStoreType=pkcs12 \
    //                   -Djavax.net.ssl.keyStorePassword=$P12_PASSWORD"
    // }

    stages {
        stage('Clone') {
            steps {
                checkout scm
            }
        }
        // stage('Compile') {
        //    steps {
        //        // Whatever it takes to compile your code
        //        // sh 'mvn compile'
        //    }
        // }

        // If you are deploying your service to Kubernetes, uncomment the following stage to make sure your Helm charts are validated before merging
        // stage('Helm Check') {
        //    steps {
        //        helmCheck()
        //    }
        // }

        // Keeping the different phases separate will give you per-phase statistics and a nicer overall structure
        // stage('Test') {
        //     steps {
        //         sh 'mvn test'
        //     }
        // }

        // stage('Docker') {
        //     when {
        //         anyOf {
        //             branch 'master'
        //             expression { getTriggerText() == 'docker push' } // Push PRs docker image only when requested
        //         }
        //     }
        //     steps {
        //         // TODO: Build image somehow
        //         dockerPush()
        //     }
        // }

        stage('Sonarqube') {
            // If you use Typescript
            // sh 'npm install typescript'
            when {
                anyOf {
                    branch 'master' // Only run Sonarqube on master...
                    changeRequest() // ... and PRs
                }
            }
            steps {
                sonarqube()
            }
        }
    }
}

