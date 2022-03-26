function n(n){return null}function e(n){return null}function t(n){return null}function r(n){return null}function i(){return{run:function(n){return n}}}var o,u,f={},a=-1;function s(n,e){f[n]=e}function d(n){return n in f?-1:(f[n]=++a,a)}function c(n){return n in f?f[n]:-1}function p(n){for(;;){if("function"!=typeof n.type)throw"non functional component";if(n.type==e)break;if("object"!=typeof(n=n.type.call(null,n.props)))throw"non react element"}return n}function l(e,i){for(var o=e.props,u=e.props.children,f=i+"."+o.name,a=o.params,h=[],g=0,v=u;g<v.length;g++){var b=v[g];if(b.type==t)for(var y=(m=b.props).params,O=0;O<y.length;++O){var N=c(i+"."+a[O]);if(N<0)throw"dependency must be defined before it's used";s(f+"."+y[O],N)}else if(b.type==r){var m,w=(m=b.props).name;if((D=c(f+"."+m.dep))<0)throw"dependency must be defined before it's used";s(f+"."+w,D)}else if(b.type==n){var D,k=b.props,I=(w=k.name,k.deps),F=[];if(I&&I.length)for(var S=0,x=I;S<x.length;S++){var B=c(f+"."+x[S]);if(B<0)throw"dependency must be defined before it's used";F.push(B)}if((D=d(f+"."+w))<0)throw"duplicate node name found "+f+"."+w;h.push({id:D,deps:F,gen:k.gen})}else{var j=p(b);h=h.concat(l(j,f))}}return h}function h(e){for(var o="",u=[],h={},g=[],v=0,b=p(e).props.children;v<b.length;v++){var y=b[v];if(y.type==t)for(var O=0,N=(D=y.props).params;O<N.length;O++){var m=N[O];if((k=d("."+m))<0)throw"duplicate node name found ."+m;u.push({id:k,deps:[],gen:i})}else if(y.type==r){var w=(D=y.props).name;if((k=c("."+D.dep))<0)throw"dependency must be defined before it's used";s("."+w,k),h[k]=w}else if(y.type==n){w=(D=y.props).name;var D,k,I=D.deps,F=[];if(I&&I.length)for(var S=0,x=I;S<x.length;S++){var B=c("."+x[S]);if(B<0)throw"dependency must be defined before it's used";F.push(B)}if((k=d("."+w))<0)throw"duplicate node name found ."+w;g.push({id:k,deps:F,gen:D.gen})}else{var j=p(y);g=g.concat(l(j,o))}}f={},a=-1;var z=function(){var n=[],e=[],t={},r=[],i={},o={build:function(){return r.sort((function(n,e){return n.id>e.id?1:-1})),{inputs:n,outputs:t,nodes:r,binding:i,zeroDepNodes:e}},input:function(e){r=r.concat(e);for(var t=0,i=e;t<i.length;t++){var u=i[t];n.push(u.id)}return o},output:function(n){return t=n,o},next:function(n){for(var t=0,u=n;t<u.length;t++){var f=u[t];0==f.deps.length&&e.push(f.id);for(var a=0,s=f.deps;a<s.length;a++){var d=s[a];d in i?i[d].push(f.id):i[d]=[f.id]}}return r=r.concat(n),o}};return o}();return z.input(u).next(g).output(h),z.build()}function g(n,e,t){if(2==n[e])return!0;if(1==n[e])return!1;if(n[e]=1,e in t.binding)for(var r=0,i=t.binding[e];r<i.length;r++){if(!g(n,i[r],t))return!1}return n[e]=2,!0}function v(n){return"{id:"+n.id+",deps:"+JSON.stringify(n.deps)+",gen:"+n.gen.name+"},"}function b(n){var e="{";e+="inputs:".concat(JSON.stringify(n.inputs),","),e+="zeroDepNodes:".concat(JSON.stringify(n.zeroDepNodes),","),e+="nodes:[";for(var t=0,r=n.nodes;t<r.length;t++){e+=v(r[t])}for(var i in e+="],",e+="outputs:{",n.outputs)e+=i+":"+JSON.stringify(n.outputs[i])+",";for(var i in e+="},",e+="binding:{",n.binding)e+=i+":"+JSON.stringify(n.binding[i])+",";return e+="},",e+="}"}function y(n){var e=n.nodes.length;if(e<=0)return o.EmptyWorkflow;for(var t=0;t<e;++t)if(n.nodes[t].id!=t)return o.NodesDisorder;for(var r=0,i=n.inputs;r<i.length;r++){var u=i[r];if(u<0||u>=n.nodes.length)return o.InputOutOfNodes}for(var f=0,a=n.zeroDepNodes;f<a.length;f++){var s=a[f];if(s<0||s>=n.nodes.length)return o.ZeroDepOutOfNodes}for(var d=0,c=Object.keys(n.outputs);d<c.length;d++){var p=c[d],l=parseInt(p);if(l<0||l>=e)return o.OutputOutOfNodes}for(var h in n.binding){var v=parseInt(h);if(v<0||v>=e)return o.BindingOutOfNodes;for(var b=0,y=n.binding[v];b<y.length;b++){if((F=y[b])<0||F>=e)return o.BindingOutOfNodes}}for(var O=0,N=n.nodes;O<N.length;O++){if((j=N[O]).deps.length)for(var m=0,w=j.deps;m<w.length;m++){if(!(w[m]in n.binding))return o.DepNotFoundInBinding}}for(var h in n.binding)for(var D=parseInt(h),k=0,I=n.binding[D];k<I.length;k++){var F=I[k];if(n.nodes[F].deps.indexOf(D)<0)return o.BindingNotFoundInDep}for(var S=Array(e).fill(0),x=0,B=n.nodes;x<B.length;x++){var j;if(!g(S,(j=B[x]).id,n))return o.CircularDetected}return o.OK}function O(n,e,t,r){return new(t||(t=Promise))((function(i,o){function u(n){try{a(r.next(n))}catch(n){o(n)}}function f(n){try{a(r.throw(n))}catch(n){o(n)}}function a(n){var e;n.done?i(n.value):(e=n.value,e instanceof t?e:new t((function(n){n(e)}))).then(u,f)}a((r=r.apply(n,e||[])).next())}))}function N(n,e){var t,r,i,o,u={label:0,sent:function(){if(1&i[0])throw i[1];return i[1]},trys:[],ops:[]};return o={next:f(0),throw:f(1),return:f(2)},"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function f(o){return function(f){return function(o){if(t)throw new TypeError("Generator is already executing.");for(;u;)try{if(t=1,r&&(i=2&o[0]?r.return:o[0]?r.throw||((i=r.return)&&i.call(r),0):r.next)&&!(i=i.call(r,o[1])).done)return i;switch(r=0,i&&(o=[2&o[0],i.value]),o[0]){case 0:case 1:i=o;break;case 4:return u.label++,{value:o[1],done:!1};case 5:u.label++,r=o[1],o=[0];continue;case 7:o=u.ops.pop(),u.trys.pop();continue;default:if(!(i=u.trys,(i=i.length>0&&i[i.length-1])||6!==o[0]&&2!==o[0])){u=0;continue}if(3===o[0]&&(!i||o[1]>i[0]&&o[1]<i[3])){u.label=o[1];break}if(6===o[0]&&u.label<i[1]){u.label=i[1],i=o;break}if(i&&u.label<i[2]){u.label=i[2],u.ops.push(o);break}i[2]&&u.ops.pop(),u.trys.pop();continue}o=e.call(n,u)}catch(n){o=[6,n],r=0}finally{t=i=0}if(5&o[0])throw o[1];return{value:o[0]?o[1]:void 0,done:!0}}([o,f])}}}function m(n){var e=n,t=0,r=u.NotStarted,i={},o={},f=[],a=[];function s(n,t){if(void 0===t)return[];var r=t;"object"==typeof t&&(r=Object.freeze(r)),n in e.outputs&&(o[e.outputs[n]]=r);var u=[],f=e.binding[n];if(f&&f.length)for(var a=0,s=f;a<s.length;a++){var d=s[a];d in i||(i[d]={}),i[d][n]=r;var c=e.nodes[d];if(Object.keys(i[d]).length==c.deps.length){for(var p=[],l=0,h=c.deps;l<h.length;l++){var g=h[l];p.push(i[d][g])}var v={node:c.gen(),id:c.id,inputs:p};delete i[d],u.push(v)}}return u}var d={state:function(){return r},reset:function(){r=u.NotStarted,i={},o={},f=[],a=[]},setTimeout:function(n){t=n},cancel:function(){r=u.Cancelled;for(var n=0,e=f;n<e.length;n++){var t=e[n];t.node.cancel&&t.node.cancel()}},run:function(){for(var n=[],i=0;i<arguments.length;i++)n[i]=arguments[i];return O(this,void 0,void 0,(function(){function i(n){var e=this;return new Promise((function(t,o){return O(e,void 0,void 0,(function(){var e,o,c=this;return N(this,(function(p){switch(p.label){case 0:for(e=function(){var e,t=n.pop(),o=void 0;try{o=(e=t.node).run.apply(e,t.inputs)}catch(n){return r=u.Failure,d.cancel(),"break"}if(o instanceof Promise){f.push(t);var p=o.then((function(n){return O(c,void 0,void 0,(function(){var e,o;return N(this,(function(c){return r!=u.Running||((e=f.indexOf(t))>=0&&f.splice(e,1),(o=s.call(d,t.id,n)).length&&a.push(i(o))),[2]}))}))})).catch((function(){r=u.Failure,d.cancel()}));a.push(p)}else{var l=s.call(d,t.id,o);n=n.concat(l)}};n.length&&"break"!==e(););p.label=1;case 1:return a.length>0?(o=a.splice(0,a.length),[4,Promise.all(o)]):[3,3];case 2:return p.sent(),[3,1];case 3:return t(!0),[2]}}))}))}))}var c,p,l,h,g;return N(this,(function(f){switch(f.label){case 0:for(t>0&&setTimeout((function(){r==u.Running&&d.cancel()}),t),r=u.Running,c=[],p=0;p<n.length;++p)c.push({node:e.nodes[e.inputs[p]].gen(),id:e.inputs[p],inputs:[n[p]]});for(l=0,h=e.zeroDepNodes;l<h.length;l++)g=h[l],c.push({node:e.nodes[g].gen(),id:g,inputs:[]});return[4,i(c)];case 1:return f.sent(),r==u.Running&&(r=Object.keys(e.outputs).length==Object.keys(o).length?u.Done:u.Failure),[2,o]}}))}))}};return d}!function(n){n[n.OK=0]="OK",n[n.EmptyWorkflow=1]="EmptyWorkflow",n[n.NodesDisorder=2]="NodesDisorder",n[n.InputOutOfNodes=3]="InputOutOfNodes",n[n.ZeroDepOutOfNodes=4]="ZeroDepOutOfNodes",n[n.OutputOutOfNodes=5]="OutputOutOfNodes",n[n.BindingOutOfNodes=6]="BindingOutOfNodes",n[n.DepNotFoundInBinding=7]="DepNotFoundInBinding",n[n.BindingNotFoundInDep=8]="BindingNotFoundInDep",n[n.CircularDetected=9]="CircularDetected"}(o||(o={})),function(n){n[n.NotStarted=0]="NotStarted",n[n.Running=1]="Running",n[n.Cancelled=2]="Cancelled",n[n.Failure=3]="Failure",n[n.Done=4]="Done"}(u||(u={}));export{u as ExecutionStatus,t as InputNodeComponent,n as NodeComponent,r as OutputNodeComponent,e as WorkflowComponent,o as WorkflowValidationStatus,h as buildJsxWorkflow,m as createWorkflowExecutor,b as dumpWorkflow,y as validateWorkflow};
