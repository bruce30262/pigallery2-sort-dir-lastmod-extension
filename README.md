# pigallery2-sort-dir-lastmod-extension
A [pigallery2](https://github.com/bpatrik/pigallery2) extension to sort directories based on their last modification date only.  

This extension is built on top of the [pigallery2-sample-extension template](https://github.com/bpatrik/pigallery2-sample-extension).  

# Motivation  
I prefer the folders in my gallery to be sorted by their last modification date ( like `ls -ltr` on Linux ). Although pigallery2 provides a "Sort directories by date" option in the settings page and even states that:
> Directory date is the last modification time of that directory not the creation date of the oldest photo.

However, the actual behavior still uses the oldest media ( if available ) in the folder to determine the sorting order, which is not what I wanted. Therefore I developed an extension that sorts directories purely based on their last modification date.

> [!IMPORTANT]  
> For sorting by a directory's "last modification date", the extension uses the directory's **`mtime`**, making it behave just like `ls -ltr` on Linux.

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
1. Enable the "Sort directories by date" option in the settings page.  
2. Sort the directories by date. You can compare the results with the output of `ls -lrt` to see if it's working correctly.  

# Implementation
> [!Note] 
> This section simply describes how I implemented this extension.

By default, pigallery2 sorts directories by date using the following logic ( [ref](https://github.com/bpatrik/pigallery2/blob/86daf00b61407487b58651af9ed3cbf7d090f70b/src/frontend/app/ui/gallery/navigator/sorting.service.ts#L266) ):  

```typescript
c.directories.sort(
    (a, b) => (a.cache.oldestMedia || a.lastModified) - (b.cache.oldestMedia || b.lastModified)
);
```  

As you can see, to sort directories purely by `lastModified`, `cache.oldestMedia` needs to be set to `null` -- which is one of the things this extension does.

However, `lastModified` in pigallery2 is calculated as `max(ctime, mtime)` ( [ref](https://github.com/bpatrik/pigallery2/blob/86daf00b61407487b58651af9ed3cbf7d090f70b/src/backend/model/fileaccess/DiskManager.ts#L25) ). This causes the sorting to behave more like `ls -lcrt`, which didn't suit me needs. To achieve the desired behavior, the extension overwrites `lastModified` with the directory's `mtime`.

With these changes, the final behavior effectively matches `ls -lrt`.

# Acknowledgements
* [bpatrik](https://github.com/bpatrik), the author of pigallery2, for creating the extension feature and providing advice and guidance on developing this extension.
* Claude and ChatGPT for helping me write code and documentation 😬.

# References
* [pigallery2/extension](https://github.com/bpatrik/pigallery2/tree/master/extension)
* [Issue #751 in pigallery2](https://github.com/bpatrik/pigallery2/issues/751)

