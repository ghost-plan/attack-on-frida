pluginManagement {
    repositories {
        maven(uri("$rootDir/repo"))
        mavenLocal()
        maven("https://s01.oss.sonatype.org/content/repositories/public/")
        maven("https://oss.sonatype.org/content/repositories/snapshots/")
        maven("https://maven.aliyun.com/repository/public")
        maven("https://maven.aliyun.com/repository/google/")
        maven("https://artifact.bytedance.com/repository/byteX/")
        maven("https://artifact.bytedance.com/repository/pangle")
        google {
            content {
                includeGroupByRegex("com\\.android.*")
                includeGroupByRegex("com\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        maven(uri("$rootDir/repo"))
        mavenLocal()
        maven("https://s01.oss.sonatype.org/content/repositories/public/")
        maven("https://oss.sonatype.org/content/repositories/snapshots/")
        maven("https://maven.aliyun.com/repository/public")
        maven("https://maven.aliyun.com/repository/google/")
        maven("https://artifact.bytedance.com/repository/byteX/")
        maven("https://artifact.bytedance.com/repository/pangle")
        google()
        mavenCentral()
    }
}

rootProject.name = "frida-android"
include(":app")
include(":mylibrary")
