"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getDefaultVars = _getDefaultVars;
exports._afterCompile = _afterCompile;
exports._prepareForBuild = _prepareForBuild;

function _getDefaultVars() {
  return {
    touchFile: '/themer.js',
    rebuild: true,
    watchStarted: false,
    firstTime: true,
    browserCount: 0,
    cwd: process.cwd(),
    extPath: '.',
    pluginErrors: [],
    lastNumFiles: 0,
    lastMilliseconds: 0,
    lastMillisecondsAppJson: 0,
    files: ['./app.json'],
    dirs: ['./app', './packages']
  };
}

function _afterCompile(compilation, vars, options) {
  var verbose = options.verbose;

  var logv = require('./pluginUtil').logv;

  logv(verbose, 'FUNCTION extjs _afterCompile');

  const path = require('path');

  let {
    files,
    dirs
  } = vars;
  const {
    cwd
  } = vars;
  files = typeof files === 'string' ? [files] : files;
  dirs = typeof dirs === 'string' ? [dirs] : dirs;

  const {
    fileDependencies,
    contextDependencies
  } = _getFileAndContextDeps(compilation, files, dirs, cwd, options);

  if (files.length > 0) {
    fileDependencies.forEach(file => {
      compilation.fileDependencies.add(path.resolve(file));
    });
  }

  if (dirs.length > 0) {
    contextDependencies.forEach(context => {
      compilation.contextDependencies.add(context);
    });
  }
}

function _getFileAndContextDeps(compilation, files, dirs, cwd, options) {
  var verbose = options.verbose;

  var logv = require('./pluginUtil').logv;

  logv(verbose, 'FUNCTION _getFileAndContextDeps');

  const uniq = require('lodash.uniq');

  const isGlob = require('is-glob');

  const {
    fileDependencies,
    contextDependencies
  } = compilation;
  const isWebpack4 = compilation.hooks;
  let fds = isWebpack4 ? [...fileDependencies] : fileDependencies;
  let cds = isWebpack4 ? [...contextDependencies] : contextDependencies;

  if (files.length > 0) {
    files.forEach(pattern => {
      let f = pattern;

      if (isGlob(pattern)) {
        f = glob.sync(pattern, {
          cwd,
          dot: true,
          absolute: true
        });
      }

      fds = fds.concat(f);
    });
    fds = uniq(fds);
  }

  if (dirs.length > 0) {
    cds = uniq(cds.concat(dirs));
  }

  return {
    fileDependencies: fds,
    contextDependencies: cds
  };
}

function _prepareForBuild(app, vars, options, output, compilation) {
  //  try {
  const log = require('./pluginUtil').log;

  const logv = require('./pluginUtil').logv;

  logv(options, '_prepareForBuild');

  const fs = require('fs');

  const recursiveReadSync = require('recursive-readdir-sync');

  var watchedFiles = [];

  try {
    watchedFiles = recursiveReadSync('./app').concat(recursiveReadSync('./packages'));
  } catch (err) {
    if (err.errno === 34) {
      console.log('Path does not exist');
    } else {
      throw err;
    }
  }

  var currentNumFiles = watchedFiles.length;
  logv(options, 'watchedFiles: ' + currentNumFiles);
  var doBuild = true;
  logv(options, 'doBuild: ' + doBuild);
  vars.lastMilliseconds = new Date().getTime();
  var filesource = 'this file enables client reload';
  compilation.assets[currentNumFiles + 'FilesUnderAppFolder.md'] = {
    source: function () {
      return filesource;
    },
    size: function () {
      return filesource.length;
    }
  };
  logv(options, 'currentNumFiles: ' + currentNumFiles);
  logv(options, 'vars.lastNumFiles: ' + vars.lastNumFiles);
  logv(options, 'doBuild: ' + doBuild);

  if (currentNumFiles != vars.lastNumFiles || doBuild) {
    vars.rebuild = true;
    var bundleDir = output.replace(process.cwd(), '');

    if (bundleDir.trim() == '') {
      bundleDir = './';
    }

    log(app + 'Building Ext bundle at: ' + bundleDir);
  } else {
    vars.rebuild = false;
  }

  vars.lastNumFiles = currentNumFiles; // }
  // catch(e) {
  //   console.log(e)
  //   compilation.errors.push('_prepareForBuild: ' + e)
  // }
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9leHRqc1V0aWwuanMiXSwibmFtZXMiOlsiX2dldERlZmF1bHRWYXJzIiwidG91Y2hGaWxlIiwicmVidWlsZCIsIndhdGNoU3RhcnRlZCIsImZpcnN0VGltZSIsImJyb3dzZXJDb3VudCIsImN3ZCIsInByb2Nlc3MiLCJleHRQYXRoIiwicGx1Z2luRXJyb3JzIiwibGFzdE51bUZpbGVzIiwibGFzdE1pbGxpc2Vjb25kcyIsImxhc3RNaWxsaXNlY29uZHNBcHBKc29uIiwiZmlsZXMiLCJkaXJzIiwiX2FmdGVyQ29tcGlsZSIsImNvbXBpbGF0aW9uIiwidmFycyIsIm9wdGlvbnMiLCJ2ZXJib3NlIiwibG9ndiIsInJlcXVpcmUiLCJwYXRoIiwiZmlsZURlcGVuZGVuY2llcyIsImNvbnRleHREZXBlbmRlbmNpZXMiLCJfZ2V0RmlsZUFuZENvbnRleHREZXBzIiwibGVuZ3RoIiwiZm9yRWFjaCIsImZpbGUiLCJhZGQiLCJyZXNvbHZlIiwiY29udGV4dCIsInVuaXEiLCJpc0dsb2IiLCJpc1dlYnBhY2s0IiwiaG9va3MiLCJmZHMiLCJjZHMiLCJwYXR0ZXJuIiwiZiIsImdsb2IiLCJzeW5jIiwiZG90IiwiYWJzb2x1dGUiLCJjb25jYXQiLCJfcHJlcGFyZUZvckJ1aWxkIiwiYXBwIiwib3V0cHV0IiwibG9nIiwiZnMiLCJyZWN1cnNpdmVSZWFkU3luYyIsIndhdGNoZWRGaWxlcyIsImVyciIsImVycm5vIiwiY29uc29sZSIsImN1cnJlbnROdW1GaWxlcyIsImRvQnVpbGQiLCJEYXRlIiwiZ2V0VGltZSIsImZpbGVzb3VyY2UiLCJhc3NldHMiLCJzb3VyY2UiLCJzaXplIiwiYnVuZGxlRGlyIiwicmVwbGFjZSIsInRyaW0iXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUFFTyxTQUFTQSxlQUFULEdBQTJCO0FBQ2hDLFNBQU87QUFDTEMsSUFBQUEsU0FBUyxFQUFFLFlBRE47QUFFTEMsSUFBQUEsT0FBTyxFQUFFLElBRko7QUFHTEMsSUFBQUEsWUFB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LENBQUNqQyxNQUFsQjtBQUF5QjtBQUZvQixHQUFqRTtBQUtBTixFQUFBQSxJQUFJLENBQUNGLE9BQUQsRUFBUyxzQkFBc0JxQyxlQUEvQixDQUFKO0FBQ0FuQyxFQUFBQSxJQUFJLENBQUNGLE9BQUQsRUFBUyx3QkFBd0JELElBQUksQ0FBQ1AsWUFBdEMsQ0FBSjtBQUNBVSxFQUFBQSxJQUFJLENBQUNGLE9BQUQsRUFBUyxjQUFjc0MsT0FBdkIsQ0FBSjs7QUFFQSxNQUFJRCxlQUFlLElBQUl0QyxJQUFJLENBQUNQLFlBQXhCLElBQXdDOEMsT0FBNUMsRUFBcUQ7QUFDbkR2QyxJQUFBQSxJQUFJLENBQUNmLE9BQUwsR0FBZSxJQUFmO0FBQ0EsUUFBSTZELFNBQVMsR0FBR2hCLE1BQU0sQ0FBQ2lCLE9BQVAsQ0FBZXpELE9BQU8sQ0FBQ0QsR0FBUixFQUFmLEVBQThCLEVBQTlCLENBQWhCOztBQUNBLFFBQUl5RCxTQUFTLENBQUNFLElBQVYsTUFBb0IsRUFBeEIsRUFBNEI7QUFBQ0YsTUFBQUEsU0FBUyxHQUFHLElBQVo7QUFBaUI7O0FBQzlDZixJQUFBQSxHQUFHLENBQUNGLEdBQUcsR0FBRywwQkFBTixHQUFtQ2lCLFNBQXBDLENBQUg7QUFDRCxHQUxELE1BTUs7QUFDSDlDLElBQUFBLElBQUksQ0FBQ2YsT0FBTCxHQUFlLEtBQWY7QUFDRDs7QUFDRGUsRUFBQUEsSUFBSSxDQUFDUCxZQUFMLEdBQW9CNkMsZUFBcEIsQ0FwQ3NFLENBcUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9nZXREZWZhdWx0VmFycygpIHtcclxuICByZXR1cm4ge1xyXG4gICAgdG91Y2hGaWxlOiAnL3RoZW1lci5qcycsXHJcbiAgICByZWJ1aWxkOiB0cnVlLFxyXG4gICAgd2F0Y2hTdGFydGVkIDogZmFsc2UsXHJcbiAgICBmaXJzdFRpbWUgOiB0cnVlLFxyXG4gICAgYnJvd3NlckNvdW50IDogMCxcclxuICAgIGN3ZDogcHJvY2Vzcy5jd2QoKSxcclxuICAgIGV4dFBhdGg6ICcuJyxcclxuICAgIHBsdWdpbkVycm9yczogW10sXHJcbiAgICBsYXN0TnVtRmlsZXM6IDAsXHJcbiAgICBsYXN0TWlsbGlzZWNvbmRzOiAwLFxyXG4gICAgbGFzdE1pbGxpc2Vjb25kc0FwcEpzb246IDAsXHJcbiAgICBmaWxlczogWycuL2FwcC5qc29uJ10sXHJcbiAgICBkaXJzOiBbJy4vYXBwJywnLi9wYWNrYWdlcyddXHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX2FmdGVyQ29tcGlsZShjb21waWxhdGlvbiwgdmFycywgb3B0aW9ucykge1xyXG4gIHZhciB2ZXJib3NlID0gb3B0aW9ucy52ZXJib3NlXHJcbiAgdmFyIGxvZ3YgPSByZXF1aXJlKCcuL3BsdWdpblV0aWwnKS5sb2d2XHJcbiAgbG9ndih2ZXJib3NlLCdGVU5DVElPTiBleHRqcyBfYWZ0ZXJDb21waWxlJylcclxuICBjb25zdCBwYXRoID0gcmVxdWlyZSgncGF0aCcpXHJcbiAgbGV0IHsgZmlsZXMsIGRpcnMgfSA9IHZhcnNcclxuICBjb25zdCB7IGN3ZCB9ID0gdmFyc1xyXG4gIGZpbGVzID0gdHlwZW9mIGZpbGVzID09PSAnc3RyaW5nJyA/IFtmaWxlc10gOiBmaWxlc1xyXG4gIGRpcnMgPSB0eXBlb2YgZGlycyA9PT0gJ3N0cmluZycgPyBbZGlyc10gOiBkaXJzXHJcbiAgY29uc3Qge1xyXG4gICAgZmlsZURlcGVuZGVuY2llcyxcclxuICAgIGNvbnRleHREZXBlbmRlbmNpZXMsXHJcbiAgfSA9IF9nZXRGaWxlQW5kQ29udGV4dERlcHMoY29tcGlsYXRpb24sIGZpbGVzLCBkaXJzLCBjd2QsIG9wdGlvbnMpO1xyXG4gIGlmIChmaWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICBmaWxlRGVwZW5kZW5jaWVzLmZvckVhY2goKGZpbGUpID0+IHtcclxuICAgICAgY29tcGlsYXRpb24uZmlsZURlcGVuZGVuY2llcy5hZGQocGF0aC5yZXNvbHZlKGZpbGUpKTtcclxuICAgIH0pXHJcbiAgfVxyXG4gIGlmIChkaXJzLmxlbmd0aCA+IDApIHtcclxuICAgIGNvbnRleHREZXBlbmRlbmNpZXMuZm9yRWFjaCgoY29udGV4dCkgPT4ge1xyXG4gICAgICBjb21waWxhdGlvbi5jb250ZXh0RGVwZW5kZW5jaWVzLmFkZChjb250ZXh0KTtcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfZ2V0RmlsZUFuZENvbnRleHREZXBzKGNvbXBpbGF0aW9uLCBmaWxlcywgZGlycywgY3dkLCBvcHRpb25zKSB7XHJcbiAgdmFyIHZlcmJvc2UgPSBvcHRpb25zLnZlcmJvc2VcclxuICB2YXIgbG9ndiA9IHJlcXVpcmUoJy4vcGx1Z2luVXRpbCcpLmxvZ3ZcclxuICBsb2d2KHZlcmJvc2UsJ0ZVTkNUSU9OIF9nZXRGaWxlQW5kQ29udGV4dERlcHMnKVxyXG4gIGNvbnN0IHVuaXEgPSByZXF1aXJlKCdsb2Rhc2gudW5pcScpXHJcbiAgY29uc3QgaXNHbG9iID0gcmVxdWlyZSgnaXMtZ2xvYicpXHJcblxyXG4gIGNvbnN0IHsgZmlsZURlcGVuZGVuY2llcywgY29udGV4dERlcGVuZGVuY2llcyB9ID0gY29tcGlsYXRpb247XHJcbiAgY29uc3QgaXNXZWJwYWNrNCA9IGNvbXBpbGF0aW9uLmhvb2tzO1xyXG4gIGxldCBmZHMgPSBpc1dlYnBhY2s0ID8gWy4uLmZpbGVEZXBlbmRlbmNpZXNdIDogZmlsZURlcGVuZGVuY2llcztcclxuICBsZXQgY2RzID0gaXNXZWJwYWNrNCA/IFsuLi5jb250ZXh0RGVwZW5kZW5jaWVzXSA6IGNvbnRleHREZXBlbmRlbmNpZXM7XHJcbiAgaWYgKGZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgIGZpbGVzLmZvckVhY2goKHBhdHRlcm4pID0+IHtcclxuICAgICAgbGV0IGYgPSBwYXR0ZXJuXHJcbiAgICAgIGlmIChpc0dsb2IocGF0dGVybikpIHtcclxuICAgICAgICBmID0gZ2xvYi5zeW5jKHBhdHRlcm4sIHsgY3dkLCBkb3Q6IHRydWUsIGFic29sdXRlOiB0cnVlIH0pXHJcbiAgICAgIH1cclxuICAgICAgZmRzID0gZmRzLmNvbmNhdChmKVxyXG4gICAgfSlcclxuICAgIGZkcyA9IHVuaXEoZmRzKVxyXG4gIH1cclxuICBpZiAoZGlycy5sZW5ndGggPiAwKSB7XHJcbiAgICBjZHMgPSB1bmlxKGNkcy5jb25jYXQoZGlycykpXHJcbiAgfVxyXG4gIHJldHVybiB7IGZpbGVEZXBlbmRlbmNpZXM6IGZkcywgY29udGV4dERlcGVuZGVuY2llczogY2RzIH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9wcmVwYXJlRm9yQnVpbGQoYXBwLCB2YXJzLCBvcHRpb25zLCBvdXRwdXQsIGNvbXBpbGF0aW9uKSB7XHJcbi8vICB0cnkge1xyXG4gICAgY29uc3QgbG9nID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9nXHJcbiAgICBjb25zdCBsb2d2ID0gcmVxdWlyZSgnLi9wbHVnaW5VdGlsJykubG9ndlxyXG4gICAgbG9ndihvcHRpb25zLCdfcHJlcGFyZUZvckJ1aWxkJylcclxuICAgIGNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKVxyXG4gICAgY29uc3QgcmVjdXJzaXZlUmVhZFN5bmMgPSByZXF1aXJlKCdyZWN1cnNpdmUtcmVhZGRpci1zeW5jJylcclxuICAgIHZhciB3YXRjaGVkRmlsZXM9W11cclxuICAgIHRyeSB7d2F0Y2hlZEZpbGVzID0gcmVjdXJzaXZlUmVhZFN5bmMoJy4vYXBwJykuY29uY2F0KHJlY3Vyc2l2ZVJlYWRTeW5jKCcuL3BhY2thZ2VzJykpfVxyXG4gICAgY2F0Y2goZXJyKSB7aWYoZXJyLmVycm5vID09PSAzNCl7Y29uc29sZS5sb2coJ1BhdGggZG9lcyBub3QgZXhpc3QnKTt9IGVsc2Uge3Rocm93IGVycjt9fVxyXG4gICAgdmFyIGN1cnJlbnROdW1GaWxlcyA9IHdhdGNoZWRGaWxlcy5sZW5ndGhcclxuICAgIGxvZ3Yob3B0aW9ucywnd2F0Y2hlZEZpbGVzOiAnICsgY3VycmVudE51bUZpbGVzKVxyXG4gICAgdmFyIGRvQnVpbGQgPSB0cnVlXHJcbiAgICBcclxuICAgIGxvZ3Yob3B0aW9ucywnZG9CdWlsZDogJyArIGRvQnVpbGQpXHJcblxyXG4gICAgdmFycy5sYXN0TWlsbGlzZWNvbmRzID0gKG5ldyBEYXRlKS5nZXRUaW1lKClcclxuICAgIHZhciBmaWxlc291cmNlID0gJ3RoaXMgZmlsZSBlbmFibGVzIGNsaWVudCByZWxvYWQnXHJcbiAgICBjb21waWxhdGlvbi5hc3NldHNbY3VycmVudE51bUZpbGVzICsgJ0ZpbGVzVW5kZXJBcHBGb2xkZXIubWQnXSA9IHtcclxuICAgICAgc291cmNlOiBmdW5jdGlvbigpIHtyZXR1cm4gZmlsZXNvdXJjZX0sXHJcbiAgICAgIHNpemU6IGZ1bmN0aW9uKCkge3JldHVybiBmaWxlc291cmNlLmxlbmd0aH1cclxuICAgIH1cclxuXHJcbiAgICBsb2d2KG9wdGlvbnMsJ2N1cnJlbnROdW1GaWxlczogJyArIGN1cnJlbnROdW1GaWxlcylcclxuICAgIGxvZ3Yob3B0aW9ucywndmFycy5sYXN0TnVtRmlsZXM6ICcgKyB2YXJzLmxhc3ROdW1GaWxlcylcclxuICAgIGxvZ3Yob3B0aW9ucywnZG9CdWlsZDogJyArIGRvQnVpbGQpXHJcblxyXG4gICAgaWYgKGN1cnJlbnROdW1GaWxlcyAhPSB2YXJzLmxhc3ROdW1GaWxlcyB8fCBkb0J1aWxkKSB7XHJcbiAgICAgIHZhcnMucmVidWlsZCA9IHRydWVcclxuICAgICAgdmFyIGJ1bmRsZURpciA9IG91dHB1dC5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKVxyXG4gICAgICBpZiAoYnVuZGxlRGlyLnRyaW0oKSA9PSAnJykge2J1bmRsZURpciA9ICcuLyd9XHJcbiAgICAgIGxvZyhhcHAgKyAnQnVpbGRpbmcgRXh0IGJ1bmRsZSBhdDogJyArIGJ1bmRsZURpcilcclxuICAgIH1cclxuICAgIGVsc2Uge1xyXG4gICAgICB2YXJzLnJlYnVpbGQgPSBmYWxzZVxyXG4gICAgfVxyXG4gICAgdmFycy5sYXN0TnVtRmlsZXMgPSBjdXJyZW50TnVtRmlsZXNcclxuICAvLyB9XHJcbiAgLy8gY2F0Y2goZSkge1xyXG4gIC8vICAgY29uc29sZS5sb2coZSlcclxuICAvLyAgIGNvbXBpbGF0aW9uLmVycm9ycy5wdXNoKCdfcHJlcGFyZUZvckJ1aWxkOiAnICsgZSlcclxuICAvLyB9XHJcbn1cclxuIl19