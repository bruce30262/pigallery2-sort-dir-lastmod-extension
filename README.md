# pigallery2-sort-dir-lastmod-extension
A [pigallery2](https://github.com/bpatrik/pigallery2) extension to sort directories based on their last modification date only.  

This extension is built on top of the [pigallery2-sample-extension template](https://github.com/bpatrik/pigallery2-sample-extension).  

# Motivation  
I prefer the folders in my gallery to be sorted by their last modification date ( similar to `ls -ltr` in Linux ). Although pigallery2 provides a "Sort directories by date" option in the settings page and states that:
> Directory date is the last modification time of that directory not the creation date of the oldest photo.

However, the actual behavior still uses the oldest media ( if available ) in the folder to determine the sorting order, which is not what I wanted. Therefore I developed an extension that sorts directories purely based on their last modification date.

> [!IMPORTANT]  
> For directory's "last modification date", the extension directly uses the `lastModified` property, which in pigallery2 is computed as `max(directory's ctime, directory's mtime)` ( [ref](https://github.com/bpatrik/pigallery2/blob/86daf00b61407487b58651af9ed3cbf7d090f70b/src/backend/model/fileaccess/DiskManager.ts#L25) ), so the final behavior of this extension is effectively a hybrid between `ls -lcrt` and `ls -ltr` on Linux.

# Installation  
There are two ways to install the extension.

## Install manually 
1. Goto the [release page](https://github.com/bruce30262/pigallery2-sort-dir-lastmod-extension/releases) and download `sort-dir-lastmod.zip`.
2. Extract the files into the `sort-dir-lastmod` directory.
3. Put the `sort-dir-lastmod` directory under the `<path to the extension folder>`, as mentioned in the [README of pigallery2 Extension](https://github.com/bpatrik/pigallery2/blob/master/extension/README.md).
   * If you're using docker to run pigallery2, `<path to the extension folder>` is `config/extensions` ( note the 's' at the end ! )
4. Goto the settings page in pigallery2 -> **Extensions** section, and make sure the extension is installed and enabled.

## Install via pigallery2  
1. Goto the settings page in pigallery2 -> **Extensions** section.
2. Edit the **Repository url** field into:
```
https://gist.githubusercontent.com/bruce30262/bbf39d12f058764014fe29e86cb0c56e/raw/pigallery2_extensions_repo.md
```
The [gist](https://gist.github.com/bruce30262/bbf39d12f058764014fe29e86cb0c56e) is a markdown file for installing the extension. It has the same format as [the one in the pigallery2 repository](https://github.com/bpatrik/pigallery2/blob/master/extension/REPOSITORY.md).

3. You will need to reload the settings page. After that, goto the **Extensions** section again, and click the **Install extensions** button.  
4. If the **Repository url** is set correctly, a modal will appear showing the extension "Sort Dir by lastModified". Click **Install** to add the extension.
5. If all went well, the extension will be installed and enabled automatically.

# Usage
Just sort the directories by date. You can compare the results with the output of `ls -lcrt` to verify that it's working correctly.  

# Implementation
> [!Note] 
> This section simply describes how I implemented this extension.

Originally, pigallery2 uses the following code to sort the directories by date ( [ref](https://github.com/bpatrik/pigallery2/blob/86daf00b61407487b58651af9ed3cbf7d090f70b/src/frontend/app/ui/gallery/navigator/sorting.service.ts#L266) ):  

```typescript
c.directories.sort(
    (a, b) => (a.cache.oldestMedia || a.lastModified) - (b.cache.oldestMedia || b.lastModified)
);
```
So what this extension does is actually pretty simple: it just overwrite the `cache.oldestMedia` to `null` so pigallery2 will always use `lastModified` to sort the directories.  

I initially wanted to sort using only `mtime` ( which was my original intention ), but doing so would require the extension to physically access each directory to retrieve the value, which could impact performance. Therefore I decided to stick with `lastModified` in the end.

# Acknowledgements
* [bpatrik](https://github.com/bpatrik), the author of pigallery2, for creating the extension feature and providing advice and guidance on developing this extension.
* Claude and ChatGPT for helping me write code and documentation 😬.

# References
* [pigallery2/extension](https://github.com/bpatrik/pigallery2/tree/master/extension)
* [Issue #751 in pigallery2](https://github.com/bpatrik/pigallery2/issues/751)

