<?php

/* /src/block/common/b-our-specialists/b-our-specialists.html.twig */
class __TwigTemplate_681612279cec4dce1910c4982cee9c8dc0d8b612f1c7c339f0b9b307120be031 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        // line 1
        echo "<div class=\"inner-row\"><div class=\"sep-line\"></div></div>
<div class=\"inner-row\"><h2>Наши специалисты</h2></div>
<div class=\"inner-row\">
\t<div class=\"b-our-specialists-content\">
\t\t<div class=\"b-our-specialists-content__text\">
\t\t\t<p class=\"grey big\">
\t\t\t\tЗаписаться на прием онколога в «СМ-Клиника» вы можете круглосуточно,
\t\t\t\tпозвонив по телефону в Москве ";
        // line 8
        echo (isset($context["phone"]) ? $context["phone"] : null);
        echo " или заполнив форму обратной связи
\t\t\t</p>
\t\t\t<p class=\"big\">
\t\t\t\t<b>В нашем центре ";
        // line 11
        echo (isset($context["directionCountDocs"]) ? $context["directionCountDocs"] : null);
        echo " ";
        echo (isset($context["docText"]) ? $context["docText"] : null);
        echo "</b>
\t\t\t</p>
\t\t\t<a href=\"/doctors/\" class=\"b-our-specialists-content__all\" data-count=\"";
        // line 13
        echo (isset($context["allCountDocs"]) ? $context["allCountDocs"] : null);
        echo "\"><span>Все специалисты</span></a>
\t\t</div>

\t\t<div class=\"b-our-specialists-content__list\">
\t\t\t";
        // line 17
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable((isset($context["docList"]) ? $context["docList"] : null));
        foreach ($context['_seq'] as $context["_key"] => $context["doc"]) {
            echo " 
\t\t\t\t<div class=\"b-our-specialists-content__item\">
\t\t\t\t\t<a href=\"";
            // line 19
            echo $this->getAttribute($context["doc"], "url", array(), "method");
            echo "\"><img src=\"";
            echo $this->getAttribute($this->getAttribute($context["doc"], "previewPicture", array(), "method"), "resizedImage", array(0 => "fit150x200"), "method");
            echo "\"></a>
\t\t\t\t\t<a href=\"";
            // line 20
            echo $this->getAttribute($context["doc"], "url", array(), "method");
            echo "\"><span>";
            echo $this->getAttribute($context["doc"], "title", array(), "method");
            echo "</span></a>
\t\t\t\t\t<div class=\"b-our-specialists-content__descr\">";
            // line 21
            echo $this->getAttribute($this->getAttribute($context["doc"], "specialty", array()), "value", array(), "method");
            echo "</div>
\t\t\t\t\t<div class=\"b-our-specialists-content__extra\">
\t\t\t\t\t\t<a class=\"button x-light upc b small radius\" data-open=\"make_appointment\">ЗАПИСАТЬСЯ</a>
\t\t\t\t\t</div>
\t\t\t\t</div>
\t\t\t";
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['_key'], $context['doc'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
        // line 27
        echo "\t\t</div>
\t\t<div class=\"b-our-specialists-content__button-more\"><a href=\"#\" class=\"b-our-specialists-content__show-more\"><span>Показать еще</span></a></div>
\t</div>
</div>
";
    }

    public function getTemplateName()
    {
        return "/src/block/common/b-our-specialists/b-our-specialists.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  79 => 27,  67 => 21,  61 => 20,  55 => 19,  48 => 17,  41 => 13,  34 => 11,  28 => 8,  19 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "/src/block/common/b-our-specialists/b-our-specialists.html.twig", "/projects/webpages/projects/oncology-centr/site/oncology-centr.ru/www/local/templates/oncology/frontend/src/block/common/b-our-specialists/b-our-specialists.html.twig");
    }
}
