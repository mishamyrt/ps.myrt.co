       <div class="container">
        <div class="container-inner">
        <div class="links">
            {{@links as $link}}
            <div data-href="{{$link['url']}}" class="links-item"> 
                    {{$link['title']}}
            </div>
            {{end}}
            <div data-href="/search/" class="links-item is__search">
                    Найти фильм
            </div>
        </div>
        </div>
        <div class="hover-zone"></div>
        <div class="container-hello">
                <h1>Кинотеатр Мирт</h1>
                <p>Наведите курсор на зону справа</p>        
        </div>
       </div>